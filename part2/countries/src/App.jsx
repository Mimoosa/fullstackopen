import { useState, useEffect } from "react";
import countryService from "./services/countries";
import weatherMapService from "./services/weatherMap";

const Input = ({ text, value, onChange }) => {
  return (
    <div>
      {text} <input value={value} onChange={onChange} />
    </div>
  );
};

const Message = ({ message }) => {
  return <p>{message}</p>;
};

const Options = ({ options, onClick }) => {
  return (
    <>
      {options.map((option) => (
        <Option
          key={option.name.official}
          details={option}
          onClick={() => {
            onClick(option.name.official);
          }}
        />
      ))}
    </>
  );
};

const Option = ({ details, onClick }) => {
  return (
    <div>
      {details.name.common}
      <Button onClick={onClick} text="Show" />
    </div>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Details = ({ name, capital, area, languages, flag }) => {
  return (
    <div>
      <Header text={name} />
      <Text title="Capital" value={capital} />
      <Text title="Area" value={area} />
      <SubHeader text="Languages" />
      <List languages={languages} />
      <img src={flag.png} alt={flag.alt} />
    </div>
  );
};

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const Text = ({ title = { title }, value = { value } }) => {
  return (
    <p>
      {title} {value}
    </p>
  );
};

const List = ({ languages }) => {
  return (
    <ul>
      {languages.map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
  );
};

const SubHeader = ({ text }) => {
  return <h2>{text}</h2>;
};

const WeatherInfo = ({ capital, temperature, icon, weather, wind }) => {
  return (
    <div>
      <SubHeader text={`Weather in ${capital}`} />
      <Text title="Temperature" value={`${temperature} Celsius`} />
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather}
      />
      <Text title="Wind" value={`${wind} m/s`} />
    </div>
  );
};

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [contryOptions, setCountryOptions] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherDetails, setWeatherDetails] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then((allCountries) => {
        setCountries(allCountries);
      })
      .catch((error) => {
        setErrorMessage("Failed to get Countries");
      });
  }, []);

  useEffect(() => {
    if (countries) {
      const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchText.toLowerCase()),
      );

      if (filteredCountries.length >= 10) {
        setCountryOptions([]);
        setSelectedCountry(null);
        setErrorMessage("Too many mathces, specify another filter");
      } else {
        setErrorMessage(null);
        if (filteredCountries.length > 1) {
          setCountryOptions(filteredCountries);
        } else if (filteredCountries.length === 1) {
          setCountryOptions([]);
          setSelectedCountry(filteredCountries[0]);
        }
      }
    }
  }, [searchText]);

  useEffect(() => {
    if (selectedCountry) {
      getWeatherDetails(selectedCountry);
    }
  }, [selectedCountry]);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleShowClick = (name) => {
    const countryToShow = countries.filter((country) =>
      country.name.official.toLowerCase().includes(name.toLowerCase()),
    );
    if (countryToShow.length === 1) {
      setSelectedCountry(countryToShow[0]);
    }
  };

  const getWeatherDetails = () => {
    weatherMapService
      .getWeather(selectedCountry.latlng[0], selectedCountry.latlng[1])
      .then((data) => {
        console.log(data);
        setWeatherDetails(data);
      });
  };

  return (
    <div>
      <Input
        text="find countries"
        value={searchText}
        onChange={handleSearchTextChange}
      />
      <Message message={errorMessage} />
      <Options options={contryOptions} onClick={handleShowClick} />
      {selectedCountry && (
        <>
          <Details
            name={selectedCountry.name.common}
            capital={selectedCountry.capital}
            area={selectedCountry.area}
            languages={Object.values(selectedCountry.languages)}
            flag={selectedCountry.flags}
          />
          {weatherDetails && (
            <WeatherInfo
              capital={selectedCountry.capital}
              temperature={weatherDetails.main.temp}
              icon={weatherDetails.weather[0].icon}
              weather={weatherDetails.weather[0].main}
              wind={weatherDetails.wind.speed}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
