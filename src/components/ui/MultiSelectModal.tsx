import React, { useState, useCallback } from 'react';
import Button from './Button';
import { OptionNode } from '../../data/unitDatabaseOptions';
import { ChevronDownIcon } from './Icons';

interface MultiSelectModalProps {
  title: string;
  options: OptionNode[];
  initialSelected: string[];
  onClose: () => void;
  onSave: (selected: string[]) => void;
}

const CheckboxTree: React.FC<{
    nodes: OptionNode[];
    selected: Set<string>;
    onToggle: (id: string, children?: OptionNode[]) => void;
}> = ({ nodes, selected, onToggle }) => {
    const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

    const handleToggleNode = (id: string) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    }

    const renderNode = (node: OptionNode, level = 0) => {
        const isSelected = selected.has(node.id);
        const hasChildren = node.children && node.children.length > 0;
        const isOpen = hasChildren && openNodes[node.id];

        return (
            <div key={node.id} style={{ marginLeft: `${level * 20}px` }}>
                <div className="flex items-center space-x-2 my-1">
                    {hasChildren && (
                        <button onClick={() => handleToggleNode(node.id)} className="p-1 rounded-full hover:bg-gray-700">
                             <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                    {!hasChildren && <div className="w-6" />}
                    
                    <label className="flex items-center space-x-2 cursor-pointer flex-grow">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggle(node.id, node.children)}
                            className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500 rounded"
                        />
                        <span className="text-gray-300">{node.label}</span>
                    </label>
                </div>
                {isOpen && hasChildren && node.children.map(child => renderNode(child, level + 1))}
            </div>
        );
    };

    return <>{nodes.map(node => renderNode(node))}</>;
};


const MultiSelectModal: React.FC<MultiSelectModalProps> = ({ title, options, initialSelected, onClose, onSave }) => {
  const [selected, setSelected] = useState(new Set(initialSelected));

  const handleToggle = useCallback((id: string, children?: OptionNode[]) => {
    const newSelected = new Set(selected);
    const descendantIds = children ? getAllDescendantIds(children) : [];
    
    if (newSelected.has(id)) {
        newSelected.delete(id);
        descendantIds.forEach(childId => newSelected.delete(childId));
    } else {
        newSelected.add(id);
        descendantIds.forEach(childId => newSelected.add(childId));
    }
    
    setSelected(newSelected);
  }, [selected]);
  
  const getAllDescendantIds = (nodes: OptionNode[]): string[] => {
      let ids: string[] = [];
      for (const node of nodes) {
          ids.push(node.id);
          if (node.children) {
              ids = [...ids, ...getAllDescendantIds(node.children)];
          }
      }
      return ids;
  };

  const handleSave = () => {
    onSave(Array.from(selected));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-indigo-400">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
           <CheckboxTree nodes={options} selected={selected} onToggle={handleToggle} />
        </div>
        <div className="flex justify-end p-4 border-t border-gray-700 space-x-2">
          <Button onClick={onClose} variant="secondary">İptal</Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectModal;