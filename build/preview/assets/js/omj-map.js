/* Oh My Juiceness — interactive location map (Leaflet 1.9.4) */
(function () {
    'use strict';

    var mapElement = document.getElementById('omj-map-live');
    if (!mapElement || !window.L) return;

    var locations = [
        {
            key: 'greenhills',
            name: 'Greenhills',
            detail: 'Greenhills Shopping Center, Ortigas Ave., San Juan City',
            coords: [14.6015643, 121.0515546],
            directions: 'https://www.google.com/maps/dir/?api=1&destination=Greenhills+Shopping+Center+San+Juan+City+Metro+Manila',
            images: [
                ['assets/img/locations/greenhills/loc-greenhills-01-800.jpg', 'assets/img/locations/greenhills/loc-greenhills-01-800.webp'],
                ['assets/img/locations/greenhills/loc-greenhills-02-800.jpg', 'assets/img/locations/greenhills/loc-greenhills-02-800.webp']
            ]
        },
        {
            key: 'eastwood',
            name: 'Eastwood',
            detail: 'Eastwood Mall, 116 Eastwood Ave., Bagumbayan, Quezon City',
            coords: [14.6105509, 121.0799139],
            directions: 'https://www.google.com/maps/dir/?api=1&destination=Eastwood+Mall+116+Eastwood+Ave+Bagumbayan+Quezon+City+Metro+Manila',
            images: [
                ['assets/img/locations/eastwood/loc-eastwood-01.jpg', 'assets/img/locations/eastwood/loc-eastwood-01.webp'],
                ['assets/img/locations/eastwood/loc-eastwood-02.jpg', 'assets/img/locations/eastwood/loc-eastwood-02.webp'],
                ['assets/img/locations/eastwood/loc-eastwood-03.jpg', 'assets/img/locations/eastwood/loc-eastwood-03.webp'],
                ['assets/img/locations/eastwood/loc-eastwood-04.jpg', 'assets/img/locations/eastwood/loc-eastwood-04.webp'],
                ['assets/img/locations/eastwood/loc-eastwood-05.jpg', 'assets/img/locations/eastwood/loc-eastwood-05.webp'],
                ['assets/img/locations/eastwood/loc-eastwood-06.jpg', 'assets/img/locations/eastwood/loc-eastwood-06.webp']
            ]
        },
        {
            key: 'uptown',
            name: 'Uptown BGC',
            detail: 'Uptown Mall, 9th Ave. cor. 36th St., Bonifacio Global City, Taguig',
            coords: [14.5564554, 121.0542316],
            directions: 'https://www.google.com/maps/dir/?api=1&destination=Uptown+Mall+9th+Ave+BGC+Taguig+Metro+Manila',
            images: [
                ['assets/img/locations/uptown/loc-uptown-01-800.jpg', 'assets/img/locations/uptown/loc-uptown-01-800.webp'],
                ['assets/img/locations/uptown/loc-uptown-02-800.jpg', 'assets/img/locations/uptown/loc-uptown-02-800.webp'],
                ['assets/img/locations/uptown/loc-uptown-03-800.jpg', 'assets/img/locations/uptown/loc-uptown-03-800.webp']
            ]
        },
        {
            key: 'parqal',
            name: 'Parqal',
            detail: 'Parqal Mall — Abaca Building, D. Macapagal Blvd., Aseana City, Parañaque',
            coords: [14.5266712, 120.989381],
            directions: 'https://www.google.com/maps/dir/?api=1&destination=Parqal+Diosdado+Macapagal+Blvd+Tambo+Paranaque+Metro+Manila',
            images: [
                ['assets/img/locations/parqal/loc-parqal-01-800.jpg', 'assets/img/locations/parqal/loc-parqal-01-800.webp'],
                ['assets/img/locations/parqal/loc-parqal-02-800.jpg', 'assets/img/locations/parqal/loc-parqal-02-800.webp'],
                ['assets/img/locations/parqal/loc-parqal-03-800.jpg', 'assets/img/locations/parqal/loc-parqal-03-800.webp'],
                ['assets/img/locations/parqal/loc-parqal-04-800.jpg', 'assets/img/locations/parqal/loc-parqal-04-800.webp'],
                ['assets/img/locations/parqal/loc-parqal-05-800.jpg', 'assets/img/locations/parqal/loc-parqal-05-800.webp']
            ]
        }
    ];

    var pinHtml = '' +
        '<svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<path d="M12 29.5C13.5 35 16.2 40.2 18 43c1.8-2.8 4.5-8 6-13.5z" fill="#FF8E06" stroke="#FFF" stroke-width="2" stroke-linejoin="round"/>' +
            '<circle cx="18" cy="18" r="16" fill="#FF8E06" stroke="#FFF" stroke-width="2"/>' +
            '<circle cx="18" cy="18" r="11.5" fill="none" stroke="#FFF" stroke-width="1.4" opacity=".95"/>' +
            '<g stroke="#FFF" stroke-width="1.4" stroke-linecap="round" opacity=".95">' +
                '<path d="M20.5 18H29M19.8 19.8l6 6M18 20.5V29M16.2 19.8l-6 6M15.5 18H7M16.2 16.2l-6-6M18 15.5V7M19.8 16.2l6-6"/>' +
            '</g>' +
            '<circle cx="18" cy="18" r="1.7" fill="#FFF"/>' +
        '</svg>';

    var pinIcon = window.L.divIcon({
        className: 'omj-pin',
        html: pinHtml,
        iconSize: [36, 44],
        iconAnchor: [18, 43],
        popupAnchor: [0, -40]
    });

    var map = window.L.map(mapElement, {
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true
    });

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    }).addTo(map);

    function createPopup(location) {
        var popup = document.createElement('div');
        popup.className = 'omj-map-popup';

        var title = document.createElement('h3');
        title.className = 'omj-map-popup__title';
        title.textContent = location.name;

        var carousel = document.createElement('div');
        carousel.className = 'omj-carousel omj-carousel--card';
        carousel.setAttribute('data-omj-carousel', location.name + ' map photos');

        var track = document.createElement('div');
        track.className = 'omj-carousel__track';
        carousel.appendChild(track);

        var directions = document.createElement('a');
        directions.className = 'omj-map-popup__directions';
        directions.href = location.directions;
        directions.target = '_blank';
        directions.rel = 'noopener';
        directions.textContent = 'Directions';

        popup.appendChild(title);
        popup.appendChild(carousel);
        popup.appendChild(directions);
        return popup;
    }

    function populateCarousel(carousel, location) {
        if (carousel.getAttribute('data-omj-images-ready') === 'true') return;

        var track = carousel.querySelector('.omj-carousel__track');
        if (!track) return;

        location.images.forEach(function (sources, index) {
            var slide = document.createElement('div');
            slide.className = 'omj-carousel__slide';

            var picture = document.createElement('picture');
            var webp = document.createElement('source');
            webp.type = 'image/webp';
            webp.srcset = sources[1];

            var image = document.createElement('img');
            image.src = sources[0];
            image.alt = location.name + ' OMJ machine — photo ' + (index + 1);
            image.loading = 'lazy';
            image.decoding = 'async';
            image.width = 800;
            image.height = 600;

            picture.appendChild(webp);
            picture.appendChild(image);
            slide.appendChild(picture);
            track.appendChild(slide);
        });

        carousel.setAttribute('data-omj-images-ready', 'true');
    }

    function setMarkerAccessibility(marker, name) {
        var markerElement = marker.getElement();
        if (!markerElement) return;
        markerElement.setAttribute('alt', name);
        markerElement.setAttribute('title', name);
        markerElement.setAttribute('aria-label', name);
        markerElement.setAttribute('role', 'button');
    }

    var bounds = [];
    var markers = {};
    locations.forEach(function (location) {
        var marker = window.L.marker(location.coords, {
            icon: pinIcon,
            keyboard: true,
            title: location.name,
            alt: location.name
        });

        marker.on('add', function () {
            setMarkerAccessibility(marker, location.name);
        });

        marker.bindPopup(createPopup(location), {
            className: 'omj-map-popup-shell',
            minWidth: 260,
            maxWidth: 300,
            autoPan: true,
            autoPanPaddingTopLeft: window.L.point(24, 72),
            autoPanPaddingBottomRight: window.L.point(24, 24)
        });

        marker.on('popupopen', function (event) {
            var popupElement = event.popup.getElement();
            var carousel = popupElement && popupElement.querySelector('[data-omj-carousel]');
            if (!carousel) return;

            populateCarousel(carousel, location);
            if (window.OMJPreview && typeof window.OMJPreview.initCarousel === 'function') {
                window.OMJPreview.initCarousel(carousel);
            }
            // Slides are injected after Leaflet measured the popup for
            // autoPan; re-measure so the taller popup stays in view.
            event.popup.update();
        });

        marker.addTo(map);
        markers[location.key] = marker;
        bounds.push(location.coords);
    });

    window.OMJMap = {
        focus: function (key) {
            var marker = markers[key];
            var location = locations.find(function (item) {
                return item.key === key;
            });
            if (!marker || !location) return false;

            // Open the popup only after the fly animation settles so
            // autoPan measures against the final view, not the mid-flight one.
            map.once('moveend', function () {
                marker.openPopup();
            });
            map.flyTo(location.coords, 16);
            return true;
        }
    };

    map.fitBounds(bounds, { padding: [48, 48] });
})();
