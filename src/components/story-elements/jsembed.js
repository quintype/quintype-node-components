import atob from "atob";
import React, { useEffect, useState } from "react";
import { WithLazy } from "../with-lazy";

const cloneScriptNode = node => {
  var script = document.createElement("script");
  script.text = node.innerHTML;
  for (var i = node.attributes.length - 1; i >= 0; i--) {
    script.setAttribute(node.attributes[i].name, node.attributes[i].value);
  }
  return script;
};

const replaceScriptNodes = node => {
  if (node.tagName === "SCRIPT") {
    node.parentNode.replaceChild(cloneScriptNode(node), node);
    if (window.instgrm) window.instgrm.Embeds.process(); // Temporary fix for instagram element on live blog page.
  } else {
    var i = 0;
    var children = node.childNodes;
    while (i < children.length) {
      replaceScriptNodes(children[i++]);
    }
  }
};

const CustomJSEmbed = props => {
  const [JSEmbed, setJSEmbed] = useState(null);

  useEffect(() => {
    JSEmbed && replaceScriptNodes(JSEmbed);
  }, []);

  useEffect(() => {
    JSEmbed && replaceScriptNodes(JSEmbed);
  }, [JSEmbed]);

  const getEmbedJS = () => {
    var embedjs = props.embedJS;
    const embed = embedjs != null ? atob(embedjs) : null;
    return embed;
  };

  return (
    <div
      ref={jsembed => {
        setJSEmbed(jsembed);
      }}
      dangerouslySetInnerHTML={{ __html: getEmbedJS() }}
    />
  );
};

const JSEmbed = props => {
  return <WithLazy margin="0px">{() => <CustomJSEmbed {...props} />}</WithLazy>;
};

export default JSEmbed;
