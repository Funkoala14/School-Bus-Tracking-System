import React, { useRef, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';

export const GoogleMapsAutocomplete = ({ label, onPlaceSelected, error, helperText, defaultValue }) => {
    const autocompleteRef = useRef(null);
    const [address, setAddress] = useState(defaultValue || '');

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

    const validateAddress = () => {
        const { street, city, state, zipcode, coordinates } = address;
        if (!street || validator.isEmpty(street)) return createErrorResponse(ERROR_MESSAGES.missingStreet);
        if (!city || validator.isEmpty(city)) return createErrorResponse(ERROR_MESSAGES.missingCity);
        if (!state || validator.isEmpty(state)) return createErrorResponse(ERROR_MESSAGES.missingState);
        if (!zipcode || validator.isEmpty(zipcode)) return createErrorResponse(ERROR_MESSAGES.missingZipcode);
        if (!coordinates || !coordinates.lat || !coordinates.lng) {
            return createErrorResponse(ERROR_MESSAGES.missingCoordinates);
        }
        return null;
    };

    useEffect(() => {
        setAddress(defaultValue);
        // if (defaultValue && autocompleteRef.current) {
        //     // Programmatically trigger the autocomplete input to use the default value
        //     autocompleteRef.current.setFields(['formatted_address']);
        //     const input = autocompleteRef.current.getPlace();
        //     input.name = defaultValue; // Setting the default address value
        //     handlePlaceChanged(); // Trigger place changed to pass the default value
        // }
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
                label={label}
                error={error}
                helperText={helperText}
                onChange={(e) => setAddress(e.target.value)}
                variant='outlined'
                fullWidth
                value={address?.address || ''}
            />
        </Autocomplete>
    );
};
