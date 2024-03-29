import { string } from "prop-types";
import React from "react";

function cloneScriptNode(node) {
  var script = document.createElement("script");
  script.text = node.innerHTML;
  for (var i = node.attributes.length - 1; i >= 0; i--) {
    script.setAttribute(node.attributes[i].name, node.attributes[i].value);
  }
  return script;
}

function replaceScriptNodes(node) {
  if (node.tagName === "SCRIPT") {
    node.parentNode.replaceChild(cloneScriptNode(node), node);
    if (window.instgrm) window.instgrm.Embeds.process(); //Temporary fix for instagram element on live blog page.
  } else {
    var i = 0;
    var children = node.childNodes;
    while (i < children.length) {
      replaceScriptNodes(children[i++]);
    }
  }
}

export default class JSEmbed extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !(this.props.id === nextProps.id && this.props.embedJS === nextProps.embedJS);
  }

  constructor(props) {
    super(props);

    this.uniqueId = "anagh";
  }

  componentDidMount() {
    replaceScriptNodes(this.JSEmbed);
  }

  componentDidUpdate() {
    replaceScriptNodes(this.JSEmbed);
  }

  getEmbedJS() {
    const embedJs = this.props.embedJS;
    if (!embedJs) return null;
    if (global) {
      return decodeURIComponent(escape(global.atob(embedJs)));
    }
    return Buffer.from(embedJs, "base64").toString("utf-8");
  }

  // Method to check the innerHTMLEmbedFile is from Facebook or not
  checkFacebookURL(innerHTMLEmbedFile) {
    return innerHTMLEmbedFile?.includes("https://www.facebook.com") || false;
  }

  render() {
    const innerHTMLEmbedFile = this.getEmbedJS();
    // isFacebookFileEmbedded will add a new className for changing the iframe style only for facebook
    const isFacebookFileEmbedded = this.checkFacebookURL(innerHTMLEmbedFile);
    return (
      <div
        className={`jsembed-wrapper ${isFacebookFileEmbedded ? 'facebook-jsembed' : ''}`}
        ref={(jsembed) => {
          this.JSEmbed = jsembed;
        }}
        dangerouslySetInnerHTML={{ __html: innerHTMLEmbedFile }}
      />
    );
  }
}

JSEmbed.propTypes = {
  id: string,
  embedJS: string,
};
