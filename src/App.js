import React, { Component, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";

function App() {
  const list = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: "Redux",
      url: "https://redux.js.org",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ];

  class Developer {
    constructor(firstname, lastname) {
      this.firstname = firstname;
      this.lastname = lastname;
    }

    getName() {
      return this.firstname + " " + this.lastname;
    }
  }

  const devFunction = new Developer("Mimka", "Functional Component");
  const devClass = new Developer("Mimka", "Class Component");

  // function searchFor(searchTerm) {
  //   return function(item) {
  //     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  //   };
  // }
  const searchFor = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

  function Search(props) {
    const { value, onChange } = props;

    return (
      <div>
        <form>
          <label htmlFor="input[type=text]">Search:</label>
          <input type="text" value={value} onChange={onChange} />
        </form>
        <p> SEARCH: the current time is {new Date().toTimeString()}</p>
      </div>
    );
  }

  function Table(props) {
    const { list, pattern, onDismiss } = props;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Object ID</th>
              <th>Title</th>
              <th>Author</th>
              <th># Comments</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.filter(searchFor(pattern)).map((item, index) => (
              <tr key={item.objectID}>
                <td>{index}</td>
                <td>{item.objectID}</td>
                <td>
                  <a href={item.url}>{item.title}</a>
                </td>
                <td>{item.author}</td>
                <td>{item.num_comments}</td>
                <td>{item.points}</td>
                <td>
                  <button
                    onClick={() => onDismiss(item.objectID)}
                    type="button"
                  >
                    Dismiss
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p> TABLE: the current time is {new Date().toTimeString()}</p>
      </div>
    );
  }

  function ListAsAFunction(props) {
    const [list, setList] = useState(props.list);
    const [searchTerm, setSearchTerm] = useState("");

    function onDismiss(objectID) {
      const newList = list.filter(item => item.objectID !== objectID);
      setList(newList);
    }

    function onSearchChange(event) {
      setSearchTerm(event.target.value);
    }

    return (
      <div>
        <h2>Hello, {props.dev.getName()}!</h2>
        <h3>The current time is {new Date().toTimeString()}</h3>
        <Search value={searchTerm} onChange={onSearchChange} />
        <Table list={list} pattern={searchTerm} onDismiss={onDismiss} />
      </div>
    );
  }

  class ListAsClass extends Component {
    constructor(props) {
      super(props);

      this.state = {
        list,
        dev: devClass,
        searchTerm: ""
      };
    }

    onDismiss = objectID => {
      const newList = this.state.list.filter(
        item => item.objectID !== objectID
      );
      this.setState({ list: newList });
    };

    onSearchChange = event => {
      this.setState({ searchTerm: event.target.value });
    };

    render() {
      const { list, dev, searchTerm } = this.state;
      return (
        <div>
          <h2>Hello, {dev.getName()}!</h2>
          <p>APP: the current time is {new Date().toTimeString()}</p>
          <Search value={searchTerm} onChange={this.onSearchChange} />
          <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
        </div>
      );
    }
  }

  return (
    <div className="App">
      <ListAsAFunction list={list} dev={devFunction} />
      <br />
      <ListAsClass />
    </div>
  );
}

export default App;
