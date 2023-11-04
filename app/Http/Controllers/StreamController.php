<?php

namespace App\Http\Controllers;

use App\Models\Country;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class StreamController extends Controller
{
    public function tv(Request $request) {
        $cacheKey = 'tv_streaming_url_from_api';

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

        $countries = Cache::remember('data_from_countries', now()->addHours(1), function () {
            return Country::all();
        });

        return Inertia::render("TVStreams", [
            "streaming_url_links" => $clean_data,
            "country" => $request->input("country"),
            "countries" => $countries
        ]);
    }

    public function radio(Request $request) {
        $cacheKey = 'radio_streaming_url_from_api_ID';

        if ($request->has("country")) {
            $cacheKey = 'radio_streaming_url_from_api_'.$request->input("country");
        }

        $data = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($request) {
            $url = "https://de1.api.radio-browser.info/json/stations/search?countrycode=ID&hidebroken=true&order=clickcount&reverse=true";
            
            if ($request->has("country")) {
                $url = "https://de1.api.radio-browser.info/json/stations/search?countrycode=".$request->input("country")."&hidebroken=true&order=clickcount&reverse=true";
            }

            $client = new Client();
            $response = $client->get($url);

            return json_decode($response->getBody(), true);
        });

        $countries = Cache::remember('data_from_countries', now()->addHours(1), function () {
            return Country::all();
        });

        return Inertia::render("RadioStreams", [
            "streaming_url_links" => $data,
            "countries" => $countries
        ]);
    }
}
