<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Datos de conexión
    $servername = "localhost";
    $username_db = "root";
    $password_db = "";
    $dbname = "huerta_escolar";

    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    // Datos del formulario de registro
    $nombre = $_POST["regname"];
    $email = $_POST["regemail"];
    $password_plana = $_POST["regpass"];
    
    // Perfil por defecto
    $perfil = "usuario";

    // --- IMPORTANTE: HASH DE CONTRASEÑA ---
    $password_hash = password_hash($password_plana, PASSWORD_DEFAULT);
    
    // --- IMPORTANTE: Actualización de la BD ---
    // Tu tabla 'usuarios.sql' tiene un campo 'Contraseña' de solo 8 caracteres (varchar(8)).
    // Un hash seguro necesita MUCHO más espacio.
    // Necesitas cambiar tu base de datos.
    // Ejecuta este comando en el SQL de tu XAMPP (en la base de datos huerta_escolar):
    // ALTER TABLE `usuarios` MODIFY `Contraseña` VARCHAR(255) NOT NULL;
    // ALTER TABLE `usuarios` MODIFY `Email` VARCHAR(100) NOT NULL;
    
    // Dejo 'Apellido' en blanco (NULL) ya que el formulario no lo pide.
    $sql = "INSERT INTO usuarios (Nombre, Apellido, Email, Contraseña, Perfil) VALUES (?, NULL, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // sss = tres strings (Nombre, Email, ContraseñaHash, Perfil)
    $stmt->bind_param("ssss", $nombre, $email, $password_hash, $perfil);

    if ($stmt->execute()) {
        // Registro exitoso
        $_SESSION['mensaje_exito_registro'] = "¡Registro exitoso! Ya puedes iniciar sesión.";
        header("Location: inicio.html");
        exit;
    } else {
        // Error (ej: nombre de usuario duplicado)
        echo "<h3 style='color:red;'>Error al registrar.</h3>";
        echo "<p>Error: " . $stmt->error . "</p>";
        echo "<p><b>POSIBLE SOLUCIÓN:</b> El campo 'Contraseña' en tu base de datos es muy corto (varchar(8)). Debe ser 'varchar(255)' para guardar contraseñas seguras.</p>";
        echo "<a href='inicio.html'>Volver a intentarlo</a>";
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: inicio.html");
    exit;
}
?>