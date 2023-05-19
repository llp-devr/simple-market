<?php
declare(strict_types=1);
require_once "db/connection.php";
function addCategory(string $title, float $tax): int
{
    global $conn;

    try {
        $result = pg_query_params(
            $conn,
            "INSERT INTO categories (title, tax) VALUES ($1, $2) RETURNING id",
            array($title, $tax));

        return (int) pg_fetch_result(
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

function listCategories(): string
{
    global $conn;

    $result = pg_query($conn, "SELECT id, title, tax FROM categories");

    // Initialize an empty array to store the categories
    $categories = array();

    // Add categories to the array
    while ($row = pg_fetch_assoc($result)) {
        $categories[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'tax' => $row['tax']
        );
    }

    // Encode the categories array as JSON
    return json_encode($categories);

}


function categoryExists(int $id): bool
{
    global $conn;

    $result = pg_query_params($conn, "SELECT id FROM categories WHERE id = $1", array($id));

    if (pg_num_rows($result) == 0) {
        return false;
    }

    return true;
}