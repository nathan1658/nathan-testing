<template>
  <div id="app-container">
    <!-- Router will render the component for the current route here -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// QuestionnaireView is no longer directly imported or used here.
// The router handles rendering the appropriate view.
</script>

<style>
/* Global styles moved from index.html */
body {
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa;
    /* nathan-secondary color was applied to body, let's ensure it's handled */
    color: #495057; /* This is .nathan-secondary */
}
.nathan-primary { color: #005A70; }
.nathan-primary-bg { background-color: #005A70; }
.nathan-secondary { color: #495057; } /* Already on body, but good to have class */
.nathan-light-bg { background-color: #eef2f5; }
.critical-warning {
    background-color: #fff3cd;
    border-left: 4px solid #ffeeba;
    color: #856404;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 0.375rem;
}
.critical-emergency {
    background-color: #f8d7da;
    border-left: 4px solid #f5c6cb;
    color: #721c24;
    padding: 1rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    border-radius: 0.375rem;
}
.question-card { /* This style might be better scoped in QuestionCard.vue if not used elsewhere */
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-bottom: 1.5rem;
    padding: 1.5rem;
}
.form-label {
    font-weight: 600;
    color: #343a40;
    margin-bottom: 0.5rem;
    display: block;
}
.form-input, .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    font-size: 1rem;
}
.form-input:focus, .form-select:focus {
    border-color: #005A70;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 90, 112, 0.25);
}
.radio-label { /* This style might be better scoped in QuestionCard.vue */
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}
.radio-label:hover {
    background-color: #f0f5f7;
}
.radio-label input[type="radio"] {
    margin-right: 0.75rem;
    accent-color: #005A70;
}
.btn-primary, .btn-lang {
    background-color: #005A70;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    transition: background-color 0.2s ease;
    border: none;
    cursor: pointer;
}
.btn-primary:hover:not(:disabled), .btn-lang:hover:not(:disabled) {
    background-color: #004354;
}
.btn-primary:disabled, .btn-lang:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
}
.btn-lang.active {
    background-color: #003f4f;
    box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);
}
.btn-secondary {
    background-color: #6c757d;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    transition: background-color 0.2s ease;
    border: none;
    cursor: pointer;
}
.btn-secondary:hover {
    background-color: #5a6268;
}
.modal { /* This style might be better scoped in modal components if not used elsewhere */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
}
.modal-content { /* This style might be better scoped in modal components */
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}
.radio-option-selected { /* This style might be better scoped in QuestionCard.vue */
    background-color: #e0f0f3;
    border-color: #005A70;
}
.loader { /* This style is used by multiple components, could be global or scoped where needed */
    border: 4px solid #f3f3f3;
    border-top: 4px solid #005A70;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.gemini-content { /* This style might be better scoped in ResultsModal.vue */
    margin-top: 1rem;
    padding: 1rem;
    background-color: #eef2f5;
    border-radius: 0.375rem;
    border: 1px solid #d1dce5;
}
.gemini-content h4 {
    font-weight: 600;
    color: #005A70;
    margin-bottom: 0.5rem;
}
.gemini-content p {
    white-space: pre-wrap; 
}
[v-cloak] { display: none; }

.container {
  /* This class definition might not be necessary if Tailwind is correctly set up.
     The QuestionnaireView.vue template uses Tailwind classes for container properties.
  */
}
</style>
