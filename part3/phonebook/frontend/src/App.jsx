import { useState, useEffect } from "react";
import phoneBookService from "./services/persons";
import Notification from "./components/Notification";

const Persons = ({ filteredPersons, persons, deletePerson }) => {
  return (
    <>
      {filteredPersons.map((person) => (
        <Person
          key={person.name}
          name={person.name}
          number={person.number}
          deletePerson={() => deletePerson(person.id, person.name)}
        />
      ))}
    </>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Person = ({ name, number, deletePerson }) => {
  return (
    <p>
      {name} {number} <Button onClick={deletePerson} text="delete" />
    </p>
  );
};

const Filter = ({ value = { value }, onChange = { onChange } }) => {
  return (
    <div>
      filter shown with
      <input value={value} onChange={onChange} />
    </div>
  );
};

const Input = ({ title, value, onChange }) => {
  return (
    <div>
      {title}: <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <Input title="name" value={newName} onChange={handleNameChange} />
      <Input title="number" value={newNumber} onChange={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    phoneBookService
      .getAll()
      .then((initialPhoneBook) => {
        setPersons(initialPhoneBook);
      })
      .catch((error) => {
        setIsSuccess(false);
        setMessage(`Failed to fetch data`);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    phoneBookService
      .create(personObject)
      .then((returnedPhoneBook) => {
        setPersons(persons.concat(returnedPhoneBook));
        setIsSuccess(true);
        setMessage(`Added ${newName}`);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      })
      .catch((error) => {
        //setPersons(persons.filter((person) => person.name != newName));
        setIsSuccess(false);
        setMessage(error.response.data.error);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      });
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      phoneBookService
        .deletePerson(id)
        .then(() => {
          setIsSuccess(true);
          setMessage(`Deleted successfully`);
          setTimeout(() => {
            setMessage(null);
          }, 2000);
          setPersons(persons.filter((person) => person.id != id));
        })
        .catch((error) => {
          setIsSuccess(false);
          setMessage(`Failed to delete.`);
          setTimeout(() => {
            setMessage(null);
          }, 2000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} isSuccess={isSuccess} />

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        filteredPersons={filteredPersons}
        persons={persons}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
