<?php
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$headers = getallheaders();

$path = parse_url($requestUri, PHP_URL_PATH);

if ($path === '/') {
    header('Location: /static/index.html');
    exit();
}

if (file_exists("./static" . $path)) {
    return false;
}

require_once "routes/categories.php";
require_once "routes/products.php";

switch ($requestUri) {
    case '/products':
        switch ($requestMethod) {
            case 'GET':
                header('Content-Type: text/json');
                echo listProducts();
                break;
            case 'POST':
                $json = file_get_contents('php://input');
                $data = json_decode($json);

                $title = $data->title;
                $price = $data->price;
                $category = $data->category;

                if ($title == "" or !is_string($title) or $price == "" or (!is_float($price)) && !is_int($price)) {
                    header('HTTP/1.1 400 Bad Request');
                    header('Content-Type: text/plain');
                    echo '400 Bad Request';
                    break;
                }
                $id = addProduct($title, $price, $category);

                if ($id == 0) {
                    header('HTTP/1.1 500 Internal Server Error');
                    header('Content-Type: text/plain');
                    echo '500 Internal Server Error';
                    break;
                }

                else if ($id == -1) {
                    header('HTTP/1.1 400 Bad Request');
                    header('Content-Type: text/plain');
                    echo '400 Bad Request';
                    break;
                }

                header('Content-Type: text/json');
                echo json_encode(['id' => $id, 'title' => $title, 'price' => $price, 'category' => $category]);
                break;
            case 'DELETE':
                header('HTTP/1.1 501 Not Implemented');
                header('Content-Type: text/plain');
                echo '501 Not Implemented';
                break;
            default:
                header('HTTP/1.1 405 Method Not Allowed');
                header('Allow: GET, POST, DELETE');
                header('Content-Type: text/plain');
                echo '405 Method Not Allowed';
                break;
        }
        break;
    case '/categories':
        switch ($requestMethod) {
            case 'GET':
                header('Content-Type: text/json');
                echo listCategories();
                break;
            case 'POST':
                $json = file_get_contents('php://input');
                $data = json_decode($json);

                $title = $data->title;
                $tax = $data->tax;

                if ($title == "" or !is_string($title) or $tax == "" or (!is_float($tax)) && !is_int($tax)) {
                    header('HTTP/1.1 400 Bad Request');
                    header('Content-Type: text/plain');
                    echo '400 Bad Request';
                    break;
                }
                $id = addCategory($title, $tax);
                if ($id == 0) {
                    header('HTTP/1.1 500 Internal Server Error');
                    header('Content-Type: text/plain');
                    echo '500 Internal Server Error';
                    break;
                }
                header('Content-Type: text/json');
                echo json_encode(['id' => $id, 'title' => $title, 'tax' => $tax]);
                break;
            case 'DELETE':
                header('HTTP/1.1 501 Not Implemented');
                header('Content-Type: text/plain');
                echo '501 Not Implemented';
                break;
            default:
                header('HTTP/1.1 405 Method Not Allowed');
                header('Allow: GET, POST');
                header('Content-Type: text/plain');
                echo '405 Method Not Allowed';
                break;
        }
        break;
    case '/sales':
        switch ($requestMethod) {
            case 'GET':
                echo 'GET /sales';
                break;
            case 'POST':
                echo 'POST /sales';
                break;
            default:
                header('HTTP/1.1 405 Method Not Allowed');
                header('Allow: GET, POST');
                header('Content-Type: text/plain');
                echo '405 Method Not Allowed';
                break;
        }
        break;
    default:
        header('HTTP/1.1 404 Not Found');
        header('Content-Type: text/plain');
        echo "404 - Not Found";
        break;
}
