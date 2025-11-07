<?php
// Iniciar la sesión al principio de todo
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Datos de conexión
    $servername = "localhost";
    $username_db = "root";
    $password_db = "";
    $dbname = "huerta_escolar";

    // Conexión a la base de datos
    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    // Obtener los datos del formulario
    $nombre = $_POST["Nombre"];
    $password = $_POST["Contraseña"];

    // --- IMPORTANTE: Consulta preparada para evitar Inyección SQL ---
    // 1. Preparar la consulta SQL con marcadores de posición (?)
    $sql = "SELECT * FROM usuarios WHERE Nombre = ? AND Contraseña = ?";
    
    // 2. Preparar la declaración
    $stmt = $conn->prepare($sql);

    // 3. Vincular los parámetros (ss = dos strings)
    $stmt->bind_param("ss", $nombre, $password);

    // 4. Ejecutar la consulta
    $stmt->execute();

    // 5. Obtener el resultado
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        // Usuario encontrado
        $row = $result->fetch_assoc();
        
        // Guardar datos en la sesión (buena práctica)
        $_SESSION['nombre'] = $row["Nombre"];
        $_SESSION['perfil'] = $row["Perfil"];

        // --- SOLUCIÓN: Redirigir a index.html ---
        // Usamos header() para redirigir al usuario.
        // Importante: no debe haber ningún 'echo' o HTML antes de header().
        header("Location: index.html");
        exit; // Terminar el script después de la redirección

    } else {
        // Usuario no encontrado o contraseña incorrecta
        echo "<h3 style='color:red;'>Nombre o contraseña incorrectos.</h3>";
        echo "<a href='inicio.html'>Volver al login</a>";
    }

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conn->close();
} else {
    // Si alguien intenta acceder al script directamente sin POST
    header("Location: inicio.html");
    exit;
}
?>