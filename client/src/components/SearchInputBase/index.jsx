import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import { useState } from 'react';

const SearchInputBase = (props) => {
    const { placeholder, onSearch } = props;
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => {
        onSearch?.(searchValue);
    };

    return <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={placeholder}
            inputProps={{ 'aria-label': 'search google maps' }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
        />
        <IconButton onClick={handleSearch} type='button' sx={{ p: '10px' }} aria-label='search'>
            <SearchIcon />
        </IconButton>
    </Paper>;
};

export default SearchInputBase;
