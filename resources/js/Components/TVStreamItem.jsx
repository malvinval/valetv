import Hls from 'hls.js';
import { useState } from 'react';

const TVStreamItem = (props) => {
    const [isError, setIsError] = useState(false)

    const element = (
        <>
            <div id='container' className='p-1'>
                <video id={props.id} controls muted className="w-44"></video>
                <p>{props.channel}</p>
            </div>
        </>
    )

    if (Hls.isSupported()) {
        var video = document.getElementById(`${props.id}`);
        var videoContainer = document.getElementById("container");

        if (video != null) {
            var hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log('video and hls.js are now bound together !');
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log(
                    'manifest loaded, found ' + data.levels.length + ' quality level',
                );
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case 1:
                            break;
                        default:
                            videoContainer.innerHTML = ""
                            hls.destroy();
                            break;
                    }
                }
            });
            hls.loadSource(props.url);
            // bind them together
            hls.attachMedia(video);

            video.play();
        }
    }

    return element
}

export default TVStreamItem