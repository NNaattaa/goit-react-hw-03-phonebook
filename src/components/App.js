import React, { Component } from "react";
import styled from "styled-components";
import uuid from "uuid/v4";
import Filter from "./Filter";
import Layout from "./Layout";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import "../base.css";

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 3rem;
`;

const Text = styled.p`
  font-size: 3rem;
`;

const SemiTitle = styled.h2`
  font-size: 4rem;
  margin-bottom: 3rem;
`;

class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem("contacts");

    if (savedContacts) {
      this.setState({
        contacts: JSON.parse(savedContacts),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
    }
  }

  addContact = (name, number) => {
    const { contacts } = this.state;
    const checkedForName = contacts.find((contact) => name === contact.name);
    if (checkedForName) {
      return alert(`${name} is already in contacts`);
    }
    const numberCheck = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g;
    const checkedNumber = numberCheck.test(number);
    if (!checkedNumber) {
      return alert("Hey! This is not a real number :)");
    }
    const newContact = {
      id: uuid(),
      name,
      number,
    };
    this.setState((prevState) => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  removeContact = (contactId) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter(({ id }) => id !== contactId),
    }));
  };

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  render() {
    const { contacts, filter } = this.state;

    const visibleContacts = this.getVisibleContacts();

    return (
      <Layout>
        <Title>Phonebook</Title>
        <ContactForm onAddContact={this.addContact} />

        <SemiTitle>Contacts</SemiTitle>
        {contacts.length >= 2 && (
          <Filter value={filter} onChangeFilter={this.changeFilter} />
        )}
        {visibleContacts.length > 0 ? (
          <ContactList
            contacts={visibleContacts}
            onRemoveContact={this.removeContact}
          />
        ) : contacts.length === 0 ? (
          <Text>There are no contacts. Add some :)</Text>
        ) : (
          <Text>No contacts found :(</Text>
        )}
      </Layout>
    );
  }
}

export default App;
