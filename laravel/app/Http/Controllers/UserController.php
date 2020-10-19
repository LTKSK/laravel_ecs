<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class UserController extends Controller
{
  public function index(Request $request) {
    return User::all();
  }

  public function create(Request $request) {
    Log::info("HOGE,huga");
    Log::error("HOGE,error");
    $name = $request->input("name");
    User::create(["name" => $name]);
    return response()->json(200);
  }
}
