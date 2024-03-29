import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import ErrorMessage from "../errorMessage/ErrorMessage";

import useMarvelService from "../../services/MarvelService";

import "./charSearchForm.scss";

const setContent = (process, Component, Message, char) => {
  switch (process) {
    case "waiting":
      return;
    case "error":
      return <ErrorMessage />;
    case "loading":
      return;
    case "confirmed":
      return char.length > 0 ? <Component /> : <Message />;
    default:
      throw new Error("Unexpected process state");
  }
};

const CharSearchForm = () => {
  const [char, setChar] = useState(null);
  const { getCharacterByName, clearError, process, setProcess } =
    useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (name) => {
    clearError();

    getCharacterByName(name)
      .then(onCharLoaded)
      .then(() => setProcess("confirmed"));
  };

  const FoundedChar = () => (
    <div className="char__search-wrapper">
      <div className="char__search-success">
        There is! Visit {char[0].name} page?
      </div>

      <Link
        to={`/characters/${char[0].id}`}
        className="button button__secondary"
      >
        <div className="inner">To page</div>
      </Link>
    </div>
  );

  const NotFoundMessage = () => (
    <div className="char__search-error">
      The character was not found. Check the name and try again
    </div>
  );
  return (
    <div className="char__search-form">
      <Formik
        initialValues={{
          charName: "",
        }}
        validationSchema={Yup.object({
          charName: Yup.string().required("This field is required"),
        })}
        onSubmit={({ charName }) => {
          updateChar(charName);
        }}
      >
        <Form>
          <label className="char__search-label" htmlFor="charName">
            Or find a character by name:
          </label>
          <div className="char__search-wrapper">
            <Field
              id="charName"
              name="charName"
              type="text"
              placeholder="Enter name"
            />
            <button
              type="submit"
              className="button button__main"
              disabled={process === "loading"}
            >
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage
            component="div"
            className="char__search-error"
            name="charName"
          />
        </Form>
      </Formik>

      {setContent(process, FoundedChar, NotFoundMessage, char)}
    </div>
  );
};

export default CharSearchForm;
