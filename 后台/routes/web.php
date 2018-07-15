<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

namespace App\Http\Controllers;
use function foo\func;
use Illuminate\Routing\RouteUrlGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::get('mp3list', 'MP3list@index');

Route::get('mp3detail/{song_mid}', function($song_mid){
    $result = DB::select('select * from `detail` where song_mid = ?', [$song_mid])[0];
    $arr = Array('song_name'=>$result->song_name, 'song_author'=>$result->song_author, 'song_mp3'=>$result->song_mp3, 'song_pic'=>$result->song_pic);
    header('Content-Type:application/json');
    return stripslashes(decodeUnicode(json_encode($arr)));

});

Route::get('test', function () {
    $result = DB::select('select * from `detail`');
    return dd($result);
});

function decodeUnicode($str)
{
    return preg_replace_callback('/\\\\u([0-9a-f]{4})/i',
        create_function(
            '$matches',
            'return mb_convert_encoding(pack("H*", $matches[1]), "UTF-8", "UCS-2BE");'
        ),
        $str);
}

class MP3list extends Controller{
    public function index(){
        $array = [];
        $result = DB::select('select `music_id` from `index`');
        foreach ($result as $item) {
            array_push($array, $item->music_id);
        }
        return $array;
    }
}


/*
class MP3detail extends Controller{
    public function index($song_mid) {
        $result = DB::select('select * from `detail` where song_mid = ?', [$song_mid])[0];
        echo var_dump($result);
        $arr = Array('1'=>'one', '2'=>'two', '3'=>'three');

    }
}
*/