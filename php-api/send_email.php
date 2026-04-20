<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer
require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Secret key check
$SECRET = "123abc";

if (!isset($data['secret']) || $data['secret'] !== $SECRET) {
    http_response_code(403);
    echo "Unauthorized";
    exit;
}

// Get email
$email = $data['email'] ?? null;

if (!$email) {
    echo "Email missing";
    exit;
}

// Create mail object
$mail = new PHPMailer(true);

try {
    // SMTP CONFIG
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;

    // YOUR GMAIL
    $mail->Username   = 'scropion480@gmail.com';
    $mail->Password   = 'ldwv tlot bnbb cagc'; // App Password

    // USE SSL (more stable)
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;

    // DEBUG + TIMEOUT (VERY IMPORTANT)
    $mail->SMTPDebug = 2;     // show errors
    $mail->Timeout = 10;      // avoid 120s hang
    $mail->SMTPKeepAlive = false;

    // Email content
    $mail->setFrom('scropion480@gmail.com', 'Login Alert');
    $mail->addAddress($email);

    $mail->Subject = 'Login Alert';
    $mail->Body    = 'You just logged into your account.';

    // Send email
    if ($mail->send()) {
        echo "Email sent successfully";
    } else {
        echo "Email failed";
    }

} catch (Exception $e) {
    echo "Mailer Error: " . $mail->ErrorInfo;
}