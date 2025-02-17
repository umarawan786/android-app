import React from "react";

import { theme } from "../constants/theme";

// Import all icons
import Arrow from "./Arrow";
import Back2 from "./Back2";
import Bell from "./Bell";
import Bin from "./Bin";
import Chat from "./Chat";
import CheckCircle from "./CheckCircle";
import Circle from "./Circle";
import Flag from "./Flag";
import Heart16 from "./Heart16";
import Heart23 from "./Heart23";
import Home from "./Home";
import Learning from "./Learning";
import Lock from "./Lock";
import Menu from "./Menu";
import Message from "./Message";
import NewPost from "./NewPost";
import Open from "./Open";
import Pen from "./Pen";
import Pencil from "./Pencil";
import Play from "./Play";
import Plus from "./Plus";
import Profile from "./Profile";
import Rainbow from "./Rainbow";
import Search from "./Search";
import Settings from "./Settings";
import Upload from "./Upload";
import X from "./X";

import NotFound from "./NotFound";

export const icons = {
  arrow: Arrow,
  back2: Back2,
  bell: Bell,
  bin: Bin,
  chat: Chat,
  checkCircle: CheckCircle,
  circle: Circle,
  flag: Flag,
  heart16: Heart16,
  heart23: Heart23,
  home: Home,
  learning: Learning,
  lock: Lock,
  menu: Menu,
  message: Message,
  newPost: NewPost,
  open: Open,
  pen: Pen,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  profile: Profile,
  rainbow: Rainbow,
  search: Search,
  settings: Settings,
  upload: Upload,
  x: X,
};

const Icon = ({ name, ...props }) => {
  let IconComponent = null;
  if (!icons.hasOwnProperty(name)) {
    IconComponent = NotFound;
  } else {
    IconComponent = icons[name];
  }

  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      {...props}
    />
  );
};

export default Icon;
