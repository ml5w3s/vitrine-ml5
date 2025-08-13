<?php
include("conexao.php");
session_start();
$conn = conectar();

$user = trim($_POST["txt_user"]);
$mail = trim($_POST["txt_mail"]);
$pass = $_POST["txt_pass"];
$conf = $_POST["txt_conf"];

// Verifica se senhas conferem
if ($pass !== $conf) {
    echo "<script>alert('Senhas não conferem'); window.history.back();</script>";
    exit;
}

// Verifica se e-mail já está cadastrado
$sql = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $mail);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo "<script>alert('E-mail já cadastrado'); window.history.back();</script>";
    exit;
}
$stmt->close();

// Cria hash seguro
$hashedPass = password_hash($pass, PASSWORD_DEFAULT);

// Insere no banco
$sql = "INSERT INTO users (name, email, email_verified_at, password, created_at, updated_at)
        VALUES (?, ?, NULL, ?, NOW(), NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $user, $mail, $hashedPass);

if ($stmt->execute()) {
    echo "<script>alert('Usuário cadastrado com sucesso'); window.location.href='../';</script>";
} else {
    echo "<script>alert('Erro ao cadastrar usuário'); window.history.back();</script>";
}

$stmt->close();
$conn->close();
?>
