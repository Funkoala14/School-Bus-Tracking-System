import React, { useRef, useEffect } from 'react';
import { TextField } from '@mui/material';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

const GoogleMapsAutocomplete = ({ label, onPlaceSelected, error, helperText, defaultValue }) => {
    const autocompleteRef = useRef(null);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            onPlaceSelected(place); // Pass the selected place data to parent
        }
    };

    useEffect(() => {
        console.log(defaultValue);
        
        if (defaultValue && autocompleteRef.current) {
            // Programmatically trigger the autocomplete input to use the default value
            autocompleteRef.current.setFields(['formatted_address']);
            const input = autocompleteRef.current.getPlace();
            input.name = defaultValue; // Setting the default address value
            handlePlaceChanged(); // Trigger place changed to pass the default value
        }
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
                variant='outlined'
                fullWidth
                defaultValue={defaultValue} // This will show the default value initially
            />
        </Autocomplete>
    );
};

export default GoogleMapsAutocomplete;
