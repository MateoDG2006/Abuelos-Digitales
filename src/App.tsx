import { useState } from "react";
import { Welcome } from "./components/Welcome";
import { Onboarding } from "./components/Onboarding";
import { RoleSelection } from "./components/RoleSelection";
import { RoleExplanation } from "./components/RoleExplanation";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Calendar } from "./components/Calendar";
import { Profile } from "./components/Profile";
import { SearchContacts } from "./components/SearchContacts";
import { Tutorial } from "./components/Tutorial";
import { Settings } from "./components/Settings";
import { VideoCall } from "./components/VideoCall";
import { MeetingHistory } from "./components/MeetingHistory";
import { RatingModal } from "./components/RatingModal";
import { ChatList } from "./components/ChatList";
import { Chat } from "./components/Chat";
import { Help } from "./components/Help";

export type UserRole =
  | "elderly"
  | "volunteer"
  | "family"
  | null;

export type Screen =
  | "welcome"
  | "onboarding"
  | "role-selection"
  | "role-explanation"
  | "register"
  | "login"
  | "dashboard"
  | "calendar"
  | "profile"
  | "search"
  | "tutorial"
  | "settings"
  | "video-call"
  | "history"
  | "chat-list"
  | "chat"
  | "help";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("welcome");
  const [selectedRole, setSelectedRole] =
    useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentCall, setCurrentCall] = useState<{
    sessionId: number;
    volunteerName: string;
    topic: string;
  } | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [completedSession, setCompletedSession] = useState<any>(null);
  const [currentChat, setCurrentChat] = useState<{
    conversationId: string;
    contactName: string;
    contactAvatar: string;
  } | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentScreen("role-explanation");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    if (selectedRole === "elderly") {
      setCurrentScreen("tutorial");
    } else {
      setCurrentScreen("dashboard");
    }
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    if (selectedRole === "elderly") {
      setCurrentScreen("tutorial");
    } else {
      setCurrentScreen("dashboard");
    }
  };

  const handleJoinCall = (sessionId: number, volunteerName: string, topic: string) => {
    setCurrentCall({ sessionId, volunteerName, topic });
    setCurrentScreen("video-call");
  };

  const handleEndCall = (sessionId: number) => {
    const session = currentCall;
    setCurrentCall(null);
    setCompletedSession(session);
    setShowRatingModal(true);
    setCurrentScreen("dashboard");
  };

  const handleSubmitRating = (rating: number, comment: string) => {
    if (completedSession) {
      // Save to meeting history
      const history = JSON.parse(localStorage.getItem('meetingHistory') || '[]');
      const newMeeting = {
        id: Date.now(),
        volunteer: completedSession.volunteerName,
        topic: completedSession.topic,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }),
        duration: '1:00',
        rating,
        comment,
      };
      history.push(newMeeting);
      localStorage.setItem('meetingHistory', JSON.stringify(history));

      // Remove from bookings
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = bookings.filter((b: any) => b.id !== completedSession.sessionId);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    }
    setShowRatingModal(false);
    setCompletedSession(null);
  };

  const handleSkipRating = () => {
    if (completedSession) {
      // Save to meeting history without rating
      const history = JSON.parse(localStorage.getItem('meetingHistory') || '[]');
      const newMeeting = {
        id: Date.now(),
        volunteer: completedSession.volunteerName,
        topic: completedSession.topic,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }),
        duration: '1:00',
      };
      history.push(newMeeting);
      localStorage.setItem('meetingHistory', JSON.stringify(history));

      // Remove from bookings
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = bookings.filter((b: any) => b.id !== completedSession.sessionId);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    }
    setShowRatingModal(false);
    setCompletedSession(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <Welcome
            onGetStarted={() => setCurrentScreen("onboarding")}
          />
        );

      case "onboarding":
        return (
          <Onboarding
            onComplete={() =>
              setCurrentScreen("role-selection")
            }
          />
        );

      case "role-selection":
        return (
          <RoleSelection
            onSelectRole={handleRoleSelect}
            onLogin={() => setCurrentScreen("login")}
          />
        );

      case "role-explanation":
        return (
          <RoleExplanation
            role={selectedRole}
            onContinue={() => setCurrentScreen("register")}
            onBack={() => setCurrentScreen("role-selection")}
          />
        );

      case "register":
        return (
          <Register
            role={selectedRole}
            onRegister={handleRegister}
            onBack={() => setCurrentScreen("role-explanation")}
          />
        );

      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onBack={() => setCurrentScreen("role-selection")}
          />
        );

      case "tutorial":
        return (
          <Tutorial
            onComplete={() => setCurrentScreen("dashboard")}
          />
        );

      case "dashboard":
        return (
          <Dashboard
            role={selectedRole}
            onNavigate={setCurrentScreen}
          />
        );

      case "calendar":
        return (
          <Calendar
            role={selectedRole}
            onBack={() => setCurrentScreen("dashboard")}
            onNavigate={setCurrentScreen}
            onJoinCall={handleJoinCall}
          />
        );

      case "profile":
        return (
          <Profile
            role={selectedRole}
            onBack={() => setCurrentScreen("dashboard")}
            onLogout={() => {
              setIsLoggedIn(false);
              setSelectedRole(null);
              setCurrentScreen("welcome");
            }}
            onNavigate={setCurrentScreen}
          />
        );

      case "search":
        return (
          <SearchContacts
            role={selectedRole}
            onBack={() => setCurrentScreen("dashboard")}
            onNavigate={(screen, params) => {
              if (screen === 'chat' && params) {
                setCurrentChat({
                  conversationId: params.conversationId,
                  contactName: params.contactName,
                  contactAvatar: params.contactAvatar,
                });
                setCurrentScreen('chat');
              } else {
                setCurrentScreen(screen as Screen);
              }
            }}
          />
        );

      case "settings":
        return (
          <Settings
            role={selectedRole}
            onBack={() => setCurrentScreen("profile")}
          />
        );

      case "video-call":
        return currentCall ? (
          <VideoCall
            role={selectedRole}
            sessionId={currentCall.sessionId}
            volunteerName={currentCall.volunteerName}
            topic={currentCall.topic}
            onEndCall={handleEndCall}
          />
        ) : null;

      case "history":
        return (
          <MeetingHistory
            role={selectedRole}
            onBack={() => setCurrentScreen("profile")}
          />
        );

      case "chat-list":
        return (
          <ChatList
            role={selectedRole}
            onBack={() => setCurrentScreen("dashboard")}
            onSelectConversation={(conversationId, contactName, contactAvatar) => {
              setCurrentChat({ conversationId, contactName, contactAvatar });
              setCurrentScreen("chat");
            }}
          />
        );

      case "chat":
        return currentChat ? (
          <Chat
            role={selectedRole}
            conversationId={currentChat.conversationId}
            contactName={currentChat.contactName}
            contactAvatar={currentChat.contactAvatar}
            onBack={() => setCurrentScreen("chat-list")}
          />
        ) : null;

      case "help":
        return (
          <Help
            role={selectedRole}
            onBack={() => setCurrentScreen("profile")}
          />
        );

      default:
        return (
          <Welcome
            onGetStarted={() => setCurrentScreen("onboarding")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">{renderScreen()}</div>
      
      {/* Rating Modal */}
      {showRatingModal && completedSession && (
        <RatingModal
          volunteerName={completedSession.volunteerName}
          topic={completedSession.topic}
          onSubmit={handleSubmitRating}
          onSkip={handleSkipRating}
        />
      )}
    </div>
  );
}