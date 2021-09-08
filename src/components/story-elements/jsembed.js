import atob from "atob";
import React, { useEffect, useState } from "react";

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

const JSEmbed = props => {
  const [JSEmbed, setJSEmbed] = useState(null);
  const [showEmbed, setshowEmbed] = useState(false);

  useEffect(() => {
    console.log("###usefff");
    JSEmbed && replaceScriptNodes(JSEmbed);
  }, []);

  useEffect(() => {
    console.log("###usefff2222");
    JSEmbed && replaceScriptNodes(JSEmbed);
  }, [JSEmbed, props.loadEmbed]);

  const getEmbedJS = () => {
    var embedjs = props.embedJS;
    const embed = embedjs != null ? atob(embedjs) : null;
    return embed;
  };

  const renderEmbed = () => {
    return (
      <div
        ref={jsembed => {
          setJSEmbed(jsembed);
        }}
        dangerouslySetInnerHTML={{ __html: getEmbedJS() }}
      />
    );
  };

  const settings = () => {
    setshowEmbed(true);
  };

  if (props.loadEmbed) {
    return (
      <>
        {!showEmbed && (
          <div className="embed-overlay" onClick={settings} style={{ background: "blue" }}>
            Click to load...
          </div>
        )}
        {showEmbed && renderEmbed()}
      </>
    );
  } else renderEmbed();
};

export default JSEmbed;
