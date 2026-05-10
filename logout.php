<?php
/**
 * Sign-out: clears the report_auth cookie and redirects to /login/.
 */
declare(strict_types=1);

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
       || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

setcookie('report_auth', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'secure'   => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);

header('Location: /login/');
exit;
