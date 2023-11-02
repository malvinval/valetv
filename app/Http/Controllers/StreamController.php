<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class StreamController extends Controller
{
    public function index(Request $request) {
        $cacheKey = 'streaming_url_from_api';

        $clean_data = [];

        $data = Cache::remember($cacheKey, now()->addMinutes(60), function () {
            $url = "https://iptv-org.github.io/api/streams.json";

            $client = new Client();
            $response = $client->get($url);
            
            return json_decode($response->getBody(), true);
        });

        foreach ($data as $dd) {
            if ($dd["channel"] != "") {
                $channel_domain = substr($dd["channel"], -2);

                if($request->has("country")) {
                    if ($channel_domain == $request->input("country")) {
                        array_push($clean_data, $dd);
                    }
                } else {
                    if ($channel_domain == "id") {
                        array_push($clean_data, $dd);
                    }
                }
            }
        }

        return Inertia::render("TVStreams", [
            "streaming_url_links" => $clean_data,
            "country" => $request->input("country"),
        ]);
    }
}
