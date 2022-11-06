import './css/styles.css';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchField = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchField.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    const { value } = evt.target; 

    if (value.trim() !== '') {
        fetchCountries(value).then(countries => {
            if (countries.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
                return;
            } else if (countries.length <= 10 && countries.length >= 2) {
                onClearInfo();

                const markup = countries.map(({ name, flags }) => 
                    `<li class='country-item'>
                        <img src='${flags.svg}' alt='${name.official} flag' width='45px'>
                        <p>${name.official}</p>
                    </li>`
                ).join("");
                countryList.innerHTML = markup;
            } else {
                onClearList();

                const markup = countries.map(({ name, capital, languages, population, flags }) => 
                    `<li class='country-information'>
                        <div class='country-title'>
                            <img src='${flags.svg}' alt='${name.official} flag' width='45px'>
                            <h2>${name.official}</h2>
                        </div>
                        <ul class='main-country-info'>
                            <li>Capital: ${capital}</li>
                            <li>Population: ${population}</li>
                            <li>Languages: ${Object.values(languages)}</li>
                        </ul>
                    </li>`
                ).join("");
                countryInfo.innerHTML = markup;
            }
        }).catch(error => {
            Notify.failure("Oops, there is no country with that name");
            onClearInfo();
            onClearList();
        });
    };
    onClearInfo();
    onClearList();
};

function onClearInfo() {
    countryInfo.innerHTML = '';
};

function onClearList() {
    countryList.innerHTML = '';
};