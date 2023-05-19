<?php

function listUsers($headers)
{
    header('Content-Type: application/json');
    echo json_encode(['message' => 'GET /product-types']);
}

function newUser($headers, $jsonData)
{
    header('Content-Type: application/json');
    echo json_encode(['message' => 'GET /product-types']);
}

?>