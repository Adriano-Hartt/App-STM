import React from 'react';
import '../styles/App.css';

/**
 * ProgressBar — Indicador visual de etapas de formulário multi-step.
 *
 * Props:
 *   steps   : string[]  — nomes das etapas ex: ["Dados Pessoais", "Vínculo", "Confirmação"]
 *   current : number    — índice da etapa atual (0-based)
 */
function ProgressBar({ steps, current }) {
  const percent = Math.round(((current) / (steps.length - 1)) * 100);

  return (
    <div className="progress-bar-wrapper">
      {/* Rótulo + contador */}
      <div className="progress-bar-header">
        <span className="progress-bar-label">{steps[current]}</span>
        <span className="progress-bar-step">
          {current + 1} / {steps.length}
        </span>
      </div>

      {/* Barra contínua */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Círculos de etapa */}
      <div className="progress-steps-row">
        {steps.map((label, i) => {
          const isDone   = i < current;
          const isActive = i === current;

          return (
            <React.Fragment key={i}>
              <div className="progress-step-item">
                <div
                  className={`progress-step-circle ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                >
                  {isDone ? '✓' : i + 1}
                </div>
                <span
                  className={`progress-step-name ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                >
                  {label}
                </span>
              </div>

              {/* Linha conectora entre círculos */}
              {i < steps.length - 1 && (
                <div className={`progress-step-connector ${isDone ? 'done' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
