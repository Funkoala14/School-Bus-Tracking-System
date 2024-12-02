import React, { useRef, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';

export const GoogleMapsAutocomplete = ({ onPlaceSelected, defaultValue = { address: '' } }) => {
    const autocompleteRef = useRef(null);
    const [address, setAddress] = useState(defaultValue || { address: '' });

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            const addressComponents = place.address_components.reduce((acc, component) => {
                const types = component.types;
                if (types.includes('route')) {
                    acc.street = component.long_name;
                } else if (types.includes('street_number')) {
                    acc.buildingOrAptNum = component.long_name;
                } else if (types.includes('locality')) {
                    acc.city = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                    acc.state = component.short_name;
                } else if (types.includes('postal_code')) {
                    acc.zipcode = component.long_name;
                }
                return acc;
            }, {});

            // Get coordinates
            const coordinates = {
                lat: place.geometry?.location.lat(),
                lng: place.geometry?.location.lng(),
            };

            // Save all extracted address data
            const fullAddress = {
                ...addressComponents,
                address: place.formatted_address,
                coordinates,
            };

            setAddress(fullAddress);
            onPlaceSelected(fullAddress);
        }
    };

    useEffect(() => {
        setAddress(defaultValue);
    }, [defaultValue]); // Re-run when defaultValue changes

    return (
        <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
            options={{
                language: 'en',
                region: 'us',
            }}
        >
            <TextField
                label={'Address'}
                onChange={(e) => setAddress({ address: e.target.value })}
                variant='outlined'
                fullWidth
                value={address?.address || ''}
            />
        </Autocomplete>
    );
};
