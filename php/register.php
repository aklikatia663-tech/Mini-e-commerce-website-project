<?php

// On indique que la réponse sera en JSON (pour JavaScript)
header('Content-Type: application/json');

// Autorisation CORS (permet d'envoyer des requêtes depuis le frontend)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Chemin du fichier où on stocke les utilisateurs
$usersFile = __DIR__ . '/users.json';

// Récupération des données envoyées par le formulaire
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Vérification : tous les champs doivent être remplis
if (empty($firstName) || empty($lastName) || empty($email) || empty($phone) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit;
}

// Vérification du format de l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit;
}

// Vérification du numéro de téléphone (format algérien)
if (!preg_match('/^(\+213|0)(5|6|7)[0-9]{8}$/', $phone)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid phone number format'
    ]);
    exit;
}

// Vérification de la sécurité du mot de passe
if (strlen($password) < 8) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 8 characters'
    ]);
    exit;
}

// Charger les utilisateurs existants s'ils existent
$users = [];
if (file_exists($usersFile)) {
    $content = file_get_contents($usersFile);
    $users = json_decode($content, true) ?? [];
}

// Vérifier si l'email existe déjà
foreach ($users as $user) {
    if ($user['email'] === $email) {
        echo json_encode([
            'success' => false,
            'message' => 'Email already registered'
        ]);
        exit;
    }
}

// Création du nouvel utilisateur
$newUser = [
    'id' => time() . rand(100, 999), // ID unique basé sur le temps
    'firstName' => htmlspecialchars($firstName), // protection contre HTML injection
    'lastName' => htmlspecialchars($lastName),
    'email' => $email,
    'phone' => htmlspecialchars($phone),
    'password' => password_hash($password, PASSWORD_DEFAULT), // mot de passe sécurisé
    'createdAt' => date('Y-m-d H:i:s') // date de création
];

// Ajouter le nouvel utilisateur à la liste
$users[] = $newUser;

// Sauvegarder dans le fichier JSON
if (file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT))) {

    // Réponse sans mot de passe (sécurité)
    $userResponse = [
        'id' => $newUser['id'],
        'firstName' => $newUser['firstName'],
        'lastName' => $newUser['lastName'],
        'email' => $newUser['email'],
        'phone' => $newUser['phone']
    ];

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'user' => $userResponse
    ]);

} else {
    // Erreur si le fichier n'a pas pu être écrit
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save user data'
    ]);
}
?>