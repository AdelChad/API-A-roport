<?php

 include('headers.php');
 include('../db/airports-class.php');

 $db = new SQLite3('../db/store.db');
 $airports = new Airports($db);

 // TODO Check 
 // $_SERVER['REQUEST_METHOD'];

switch( $_SERVER['REQUEST_METHOD'] ) {
    case "GET":

        $all_airports = $airports->read();

        http_response_code(200);
        echo json_encode(["airport" => $all_airports]);

    break;
    
    case "POST":

        $data = json_decode(file_get_contents("php://input"));
        $airports->create($data);

        http_response_code(200);
        echo json_encode(["new airport" => "Votre aeroport à été crée"]);
    break;

    case "PUT":

        $data = json_decode(file_get_contents("php://input"));
        $airports->update($data);

        http_response_code(200);
        echo json_encode(["update airport" => "Votre aeroport à été mis à jour"]);
    break;
    
    case "DELETE":

        $data = json_decode(file_get_contents("php://input"));
        $airports->delete($data);

        http_response_code(200);
        echo json_encode(["delete airport" => "Votre aeroport à été supprimé"]);
    break;

    default:

    break;
}