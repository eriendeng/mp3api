<?php
/**
 * Created by PhpStorm.
 * User: erien
 * Date: 2018/7/12
 * Time: 下午2:43
 */

$servername = "sqld-gz.bcehost.com";
$username = "89769dec9cbb4afd9b9dbfde4a2f97ac";
$password = "0e90b2b791024ff6b3994707157a2afc";
$dbname = "BygZrBSdIEoJOfmUVLml";

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

$sql = "SELECT * FROM `index`;";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // 输出数据
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - Name: " . $row["music_id"]."<br>";
    }
} else {
    echo "0 结果";
}
$conn->close();
?>