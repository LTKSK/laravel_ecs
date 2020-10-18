<?php

namespace App\Logging;
use Monolog\Formatter\LineFormatter;

class JsonFormatter extends LineFormatter {
  public function format($record) {
    return json_encode($record);
  }
}
