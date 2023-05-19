<?php

declare(strict_types=1);
require_once "db/connection.php";
require_once "categories.php";
function addProduct(string $title, float $price, int $category): int
{
    global $conn;

    if (!categoryExists($category)) {
        return -1;
    }

    try {
        $result = pg_query_params(
            $conn,
            "INSERT INTO products (title, price, category) VALUES ($1, $2, $3) RETURNING id",
            array($title, $price, $category));

        return (int)pg_fetch_result(
            $result,
            0,
            'id');
    } catch (Exception $e) {
        // Handle any errors
        $errorMessage = 'Error occurred: ' . $e->getMessage();

        // Log error to a file
        $logFile = 'error.log';
        file_put_contents($logFile, $errorMessage . PHP_EOL, FILE_APPEND);

        return 0;
    }
}

function listProducts(): string
{
    global $conn;

    $result = pg_query($conn, "SELECT p.id as id, p.title as title, p.price as price, c.title as category, c.tax as tax FROM products as p LEFT JOIN categories as c on p.category = c.id");

    // Initialize an empty array to store the categories
    $products = array();

    // Add categories to the array
    while ($row = pg_fetch_assoc($result)) {
        $products[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'price' => $row['price'],
            'category' => $row['category'],
            'tax' => $row['tax'],
        );
    }

    // Encode the categories array as JSON
    return json_encode($products);
}