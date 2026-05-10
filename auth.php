<?php
/**
 * Sign-in handler. Validates submitted credentials against auth.config.php
 * and, on success, sets the report_auth cookie that .htaccess gates on.
 *
 * Failures redirect back to /login/?error=1 (with the original ?next=
 * preserved so the user lands where they were trying to go).
 */
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method not allowed.');
}

$configPath = __DIR__ . '/auth.config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    exit('Auth not configured.');
}
$cfg = require $configPath;

$username = isset($_POST['username']) ? trim((string) $_POST['username']) : '';
$password = isset($_POST['password']) ? (string) $_POST['password'] : '';
$next     = isset($_POST['next']) ? (string) $_POST['next'] : '/';

// Only allow same-site relative paths for the post-login redirect.
if (!preg_match('#^/[^?#\s]*$#', $next) || str_starts_with($next, '/login/') || str_starts_with($next, '/auth.php')) {
    $next = '/';
}

// Constant-time comparison so the failure latency doesn't leak which
// half of the credential pair was wrong.
$userOk = hash_equals((string) $cfg['username'], $username);
$passOk = hash_equals((string) $cfg['password'], $password);

if (!$userOk || !$passOk) {
    // Tiny pause to discourage brute force.
    usleep(400_000);
    $qs = http_build_query(['error' => 1, 'next' => $next]);
    header('Location: /login/?' . $qs);
    exit;
}

// Auth ok — set the gate cookie. HttpOnly + Secure + SameSite=Lax.
$secure  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

setcookie('report_auth', (string) $cfg['cookie_secret'], [
    'expires'  => time() + (int) $cfg['cookie_ttl'],
    'path'     => '/',
    'secure'   => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);

header('Location: ' . $next);
exit;
