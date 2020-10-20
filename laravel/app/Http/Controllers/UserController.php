<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserController extends Controller
{
  public function index(Request $request) {
    return User::all();
  }

  public function create(Request $request) {
    $name = $request->input("name");
    DB::beginTransaction();
    try{
      User::create(["name" => $name]);
      DB::commit();
    } catch(\Exception $err) {
      DB::rollBack();
      Log::error("User'${name}'の作成に失敗", [
        'name' => $name
      ]);
      return response()->json([
        "message" => "予期せぬエラーでUserの作成に失敗"
      ], 500);
    }
    return response()->json(200);
  }
}
