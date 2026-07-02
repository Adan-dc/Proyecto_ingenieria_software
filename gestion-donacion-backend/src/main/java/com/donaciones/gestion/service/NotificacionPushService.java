package com.donaciones.gestion.service;

import com.donaciones.gestion.dto.NotificacionTokenDTO;
import com.donaciones.gestion.model.DispositivoNotificacion;
import com.donaciones.gestion.model.GestionDonacion;
import com.donaciones.gestion.repository.DispositivoNotificacionRepository;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileInputStream;
import java.util.List;

@Service
public class NotificacionPushService {

    private final DispositivoNotificacionRepository dispositivoRepository;

    @Value("${firebase.notifications.enabled:false}")
    private Boolean notificacionesHabilitadas;

    @Value("${firebase.service-account.path:}")
    private String firebaseServiceAccountPath;

    private FirebaseMessaging firebaseMessaging;

    public NotificacionPushService(DispositivoNotificacionRepository dispositivoRepository) {
        this.dispositivoRepository = dispositivoRepository;
    }

    @PostConstruct
    public void inicializarFirebase() {
        if (!Boolean.TRUE.equals(notificacionesHabilitadas)) {
            System.out.println("Firebase Push: notificaciones deshabilitadas.");
            return;
        }

        if (firebaseServiceAccountPath == null || firebaseServiceAccountPath.isBlank()) {
            System.out.println("Firebase Push: no se configuró firebase.service-account.path");
            return;
        }

        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FileInputStream serviceAccount = new FileInputStream(firebaseServiceAccountPath);

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
            }

            this.firebaseMessaging = FirebaseMessaging.getInstance();

            System.out.println("Firebase Push: inicializado correctamente.");

        } catch (Exception error) {
            System.out.println("Firebase Push: error inicializando Firebase: " + error.getMessage());
        }
    }

    public DispositivoNotificacion registrarToken(NotificacionTokenDTO dto) {
        String rutNormalizado = normalizarRut(dto.getRutDonante());
        String token = dto.getTokenFcm();

        if (rutNormalizado == null || rutNormalizado.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El RUT del donante es obligatorio"
            );
        }

        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El token FCM es obligatorio"
            );
        }

        DispositivoNotificacion dispositivo = dispositivoRepository.findByTokenFcm(token)
                .orElse(new DispositivoNotificacion());

        dispositivo.setRutDonante(rutNormalizado);
        dispositivo.setTokenFcm(token);
        dispositivo.setActivo(true);

        return dispositivoRepository.save(dispositivo);
    }

    public void notificarSolicitudAceptada(GestionDonacion donacion) {
        String titulo = "Solicitud aceptada";
        String cuerpo = "Tu donación de " + obtenerArticulo(donacion) +
                " fue aceptada. Ahora puedes llevarla al punto de acopio.";

        enviarNotificacionEstado(donacion, titulo, cuerpo, "ACEPTADA");
    }

    public void notificarSolicitudRechazada(GestionDonacion donacion) {
        String titulo = "Solicitud rechazada";
        String cuerpo = "Tu solicitud de donación de " + obtenerArticulo(donacion) +
                " fue rechazada por la administración.";

        enviarNotificacionEstado(donacion, titulo, cuerpo, "RECHAZADA");
    }

    private void enviarNotificacionEstado(
            GestionDonacion donacion,
            String titulo,
            String cuerpo,
            String estado
    ) {
        if (!Boolean.TRUE.equals(notificacionesHabilitadas)) {
            return;
        }

        if (firebaseMessaging == null) {
            System.out.println("Firebase Push: FirebaseMessaging no está inicializado.");
            return;
        }

        String rutNormalizado = normalizarRut(donacion.getRutDonante());

        if (rutNormalizado == null || rutNormalizado.isBlank()) {
            return;
        }

        List<DispositivoNotificacion> dispositivos =
                dispositivoRepository.findByRutDonanteAndActivoTrue(rutNormalizado);

        if (dispositivos.isEmpty()) {
            System.out.println("Firebase Push: no hay dispositivos para RUT " + rutNormalizado);
            return;
        }

        for (DispositivoNotificacion dispositivo : dispositivos) {
            enviarAUnDispositivo(dispositivo, donacion, titulo, cuerpo, estado);
        }
    }

    private void enviarAUnDispositivo(
            DispositivoNotificacion dispositivo,
            GestionDonacion donacion,
            String titulo,
            String cuerpo,
            String estado
    ) {
        try {
            Message message = Message.builder()
                    .setToken(dispositivo.getTokenFcm())
                    .setNotification(
                            Notification.builder()
                                    .setTitle(titulo)
                                    .setBody(cuerpo)
                                    .build()
                    )
                    .putData("tipo", "estado_solicitud")
                    .putData("solicitudId", String.valueOf(donacion.getId()))
                    .putData("estado", estado)
                    .putData("rutDonante", donacion.getRutDonante() == null ? "" : donacion.getRutDonante())
                    .setAndroidConfig(
                            AndroidConfig.builder()
                                    .setPriority(AndroidConfig.Priority.HIGH)
                                    .setNotification(
                                            AndroidNotification.builder()
                                                    .setChannelId("donaciones")
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            String respuesta = firebaseMessaging.send(message);

            System.out.println("Firebase Push enviado: " + respuesta);

        } catch (FirebaseMessagingException error) {
            System.out.println("Firebase Push: error al enviar: " + error.getMessage());

            MessagingErrorCode codigo = error.getMessagingErrorCode();

            if (
                    codigo == MessagingErrorCode.UNREGISTERED ||
                    codigo == MessagingErrorCode.INVALID_ARGUMENT
            ) {
                dispositivo.setActivo(false);
                dispositivoRepository.save(dispositivo);
            }

        } catch (Exception error) {
            System.out.println("Firebase Push: error inesperado: " + error.getMessage());
        }
    }

    private String obtenerArticulo(GestionDonacion donacion) {
        if (donacion.getObjetoADonar() != null && !donacion.getObjetoADonar().isBlank()) {
            return donacion.getObjetoADonar();
        }

        return "tu solicitud";
    }

    private String normalizarRut(String rut) {
        if (rut == null) {
            return null;
        }

        String limpio = rut.trim()
                .replace(".", "")
                .replace(" ", "")
                .toUpperCase();

        if (limpio.isBlank()) {
            return null;
        }

        if (limpio.contains("-")) {
            String[] partes = limpio.split("-");

            if (partes.length >= 2) {
                String cuerpo = partes[0].replace("-", "");
                String dv = partes[1];
                return cuerpo + "-" + dv;
            }
        }

        if (limpio.length() > 1) {
            String cuerpo = limpio.substring(0, limpio.length() - 1);
            String dv = limpio.substring(limpio.length() - 1);
            return cuerpo + "-" + dv;
        }

        return limpio;
    }
}