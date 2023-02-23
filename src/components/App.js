import Footer from "./Footer.js";
import Header from "./Header.js";
import Main from "./Main.js";
import PopupWithForm from "./PopupWithForm.js";
import React, { useState } from "react";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoute.js";
import Login from "./Login.js";
import Register from "./Register.js";
import auth from "../utils/Auth.js";
import InfoTooltip from "./InfoTooltip.js";

function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = React.useState({});
  const [isEditProfilePopupOpen, setEditProfileOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlaceOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarOpen] = React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [isSuccesfull, setSuccesfull] = React.useState(true);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    document.body.classList.add("page");
  });

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getUserId()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .getInitialCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => {
          console.log(err);
        });
      handleCheckToken();
    }
  }, [loggedIn]);

  function handleLogin(inputs) {
    auth
      .autorize({ email: inputs.email, password: inputs.password })
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          handleCheckToken();
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setSuccesfull(false);
        setInfoTooltipOpen(true);
      });
  }

  function handleRegister(inputs) {
    auth
      .register({ email: inputs.email, password: inputs.password })
      .then(() => {
        setSuccesfull(true);
        setInfoTooltipOpen(true);
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        setSuccesfull(false);
        setInfoTooltipOpen(true);
        console.log(err);
      });
  }

  function handleCheckToken() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            console.log(res.data.email);
            console.log(jwt);
            setEmail(res.data.email);
            setLoggedIn(true);
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleSignout() {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    setEmail("");
  }

  function handleEditAvatarClick() {
    setEditAvatarOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfileOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlaceOpen(true);
  }

  function closeAllPoups() {
    setEditAvatarOpen(false);
    setEditProfileOpen(false);
    setAddPlaceOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard({ name: card.name, link: card.link });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api
        .addLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleUpdateUser(inputs) {
    console.log(inputs);
    api
      .patchUserInfo({ name: inputs.name, description: inputs.about })
      .then((data) =>
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
        })
      )

      .then(() => closeAllPoups())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(input) {
    api
      .patchUserAvatar({ link: input.avatar })
      .then((data) =>
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
        })
      )
      .then(() => closeAllPoups())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddCard(inputs) {
    console.log(inputs);
    api
      .addNewCard({ name: inputs.name, link: inputs.link })
      .then((newCard) => setCards([newCard, ...cards]))
      .then(() => closeAllPoups())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id != card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header email={email} onSignout={handleSignout} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onDelete={handleCardDelete}
                cards={cards}
                element={Main}
              />
            }
          ></Route>
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLogin} />}
          ></Route>
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          ></Route>
        </Routes>

        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPoups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPoups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPoups}
          onAddCard={handleAddCard}
        />
        <PopupWithForm
          name="_confirmation"
          title="Вы уверены"
          buttonText="да"
          onClose={closeAllPoups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          isSuccesfull={isSuccesfull}
          onClose={closeAllPoups}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPoups} />
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
