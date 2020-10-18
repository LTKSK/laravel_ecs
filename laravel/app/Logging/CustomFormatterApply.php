<?php

namespace App\Logging;

use App\Logging\JsonFormatter;

class CustomFormtterApply {
  public function __invoke($logging) {
    $jsonFormatter = new LineExFormatter();

    foreach ($logging->getHandlers() as $handler) {
      $handler->setFormatter($jsonFormatter);
    }
  }
}
