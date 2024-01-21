<?php
// Retrieve 'cartContent' from the POST request
$cartContent = $_POST['cartContent']; // Ensure proper validation and sanitization

// Serialize the received data
$serializedData = serialize($cartContent);

// Output the serialized data
echo $serializedData;
?>