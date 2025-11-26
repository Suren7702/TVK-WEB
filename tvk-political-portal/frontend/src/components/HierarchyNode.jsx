// src/components/HierarchyNode.jsx
import { useState } from "react";

const TYPE_LABELS = {
  union: "யூனியன்",
  village: "கிராமம்",
  ward: "வார்டு",
  booth: "பூத்"
};

export default function HierarchyNode({ node }) {
  const [open, setOpen] = useState(node.type === "union"); // unions open by default

  const hasChildren =
    node.villages?.length ||
    node.wards?.length ||
    node.booths?.length;

  const children =
    node.villages || node.wards || node.booths || [];

  return (
    <div className={`tree-node tree-node-${node.type}`}>
      <div
        className="tree-node-header"
        onClick={() => hasChildren && setOpen(!open)}
      >
        <div className="tree-node-main">
          {hasChildren && (
            <span className="tree-node-toggle">
              {open ? "−" : "+"}
            </span>
          )}
          {!hasChildren && (
            <span className="tree-node-dot">•</span>
          )}

          <div>
            <div className="tree-node-title">
              <span className="tree-node-tag">
                {TYPE_LABELS[node.type] || "துறை"}
              </span>
              <span className="tree-node-name">{node.nameTa}</span>
            </div>
            <div className="tree-node-role">
              {node.roleTa} – {node.person}
            </div>
          </div>
        </div>

        <div className="tree-node-contact">
          {node.phone && (
            <a href={`tel:${node.phone}`} className="tree-node-phone">
              📞 {node.phone}
            </a>
          )}
        </div>
      </div>

      {hasChildren && open && (
        <div className="tree-node-children">
          {children.map((child) => (
            <HierarchyNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
