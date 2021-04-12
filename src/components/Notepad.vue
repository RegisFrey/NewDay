<template>
  <div class="nd-notes" ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, watch } from 'vue';
import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import { loadNotes } from '../state/notes';

export default defineComponent({
  setup() {
    const editor: Ref<null | HTMLElement> = ref(null);

    onMounted(async () => {
      const notesHtml = await loadNotes();
      const editorEl = editor.value;

      if (editorEl !== null) {
        const mediumEditor = new MediumEditor(editorEl, {
          paste: {
            cleanPastedHTML: true,
            forcePlainText: false,
          },
        });

        if (mediumEditor) {
          function updateEditor(htmlContent: string) {
            if (editorEl && mediumEditor) {
              mediumEditor.setContent(htmlContent);
              editorEl.innerHTML = htmlContent; // needed?
            }
          }

          updateEditor(notesHtml.value);

          mediumEditor.subscribe('editableInput', function (event, editable) {
            // notesHtml.value = mediumEditor.serialize()
            if (editorEl && mediumEditor && notesHtml) {
              notesHtml.value = editorEl.innerHTML;
            }
          });

          watch(notesHtml, (newHtml) => {
            if (newHtml !== editorEl.innerHTML) {
              updateEditor(newHtml);
            }
          });
        }
      }
    });

    return { editor };
  },
});
</script>

<style>
.nd-notes {
  min-height: 100%;
  --notes-font-size-base: 18px;
  --notes-font-size-large: 24px;
  font-size: var(--notes-font-size-base);

  overflow: scroll;
  min-height: 0;
  height: 100%;

  position: relative;

  /* accomodate bullets hanging off left */
  margin-left: -8px;
  padding-left: 8px;
}
.nd-notes:focus {
  outline: none;
}

/* CONTENT THEME */
.nd-notes h1,
.nd-notes h2,
.nd-notes h3,
p {
  margin: 0;
  padding: 0;
}
.nd-notes h1 {
  font-size: var(--notes-font-size-large);
  font-weight: bold;
}
.nd-notes h2 {
  font-size: var(--notes-font-size-large);
  font-weight: normal;
}
.nd-notes h3 {
  font-size: var(--notes-font-size-base);
  font-weight: bold;
}
.nd-notes p {
  padding-bottom: 8px;
  font-size: var(--notes-font-size-base);
}
.nd-notes ol,
.nd-notes ul {
  padding: 8px;
  padding-left: 10px;
  margin: 0;
  margin-left: 8px;
}
.nd-notes li:before {
  content: '';
  margin-left: -2px;
}
.nd-notes blockquote {
  border-left: 4px solid var(--color-linework-emphasized);
  padding: 4px 8px;
  padding-left: 12px; /* 16 - 4 */
  margin: 4px 0;
}

/* EDITOR THEME */
.medium-editor-placeholder:after {
  padding-left: 16px;
  color: var(--color-text-subtle);
}
.medium-toolbar-arrow-under:after {
  border-color: var(--color-surface-inverse) transparent transparent transparent;
  top: 40px;
}
.medium-toolbar-arrow-over:before {
  border-color: transparent transparent var(--color-surface-inverse) transparent;
}
.medium-editor-toolbar {
  background-color: var(--color-surface-inverse);
  border: none;
  border-radius: 50px;
}
.medium-editor-toolbar li button {
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  color: var(--color-text-inverse);
  height: 40px;
  min-width: 40px;
  padding: 5px 12px;
  -webkit-transition: background-color 0.2s ease-in, color 0.2s ease-in;
  transition: background-color 0.2s ease-in, color 0.2s ease-in;
}
.medium-editor-toolbar li button:hover {
  background-color: var(--color-surface-inverse);
  color: var(--color-highlight);
}
.medium-editor-toolbar li .medium-editor-button-first {
  border-bottom-left-radius: 50px;
  border-top-left-radius: 50px;
  padding-left: 24px;
}
.medium-editor-toolbar li .medium-editor-button-last {
  border-bottom-right-radius: 50px;
  border-right: none;
  border-top-right-radius: 50px;
  padding-right: 24px;
}
.medium-editor-toolbar li .medium-editor-button-active {
  background-color: var(--color-surface-inverse);
  color: var(--color-highlight);
}

.medium-editor-toolbar-form {
  background: var(--color-surface-inverse);
  border-radius: 50px;
  color: var(--color-text-inverse);
  overflow: hidden;
}
.medium-editor-toolbar-form .medium-editor-toolbar-input {
  background: var(--color-surface-inverse);
  box-sizing: border-box;
  color: var(--color-text-inverse);
  height: 40px;
  padding-left: 16px;
  width: 220px;
}
.medium-editor-toolbar-form
  .medium-editor-toolbar-input::-webkit-input-placeholder {
  color: #f8f5f3;
  color: rgba(248, 245, 243, 0.8);
}
.medium-editor-toolbar-form .medium-editor-toolbar-input:-moz-placeholder {
  /* Firefox 18- */
  color: #f8f5f3;
  color: rgba(248, 245, 243, 0.8);
}
.medium-editor-toolbar-form .medium-editor-toolbar-input::-moz-placeholder {
  /* Firefox 19+ */
  color: #f8f5f3;
  color: rgba(248, 245, 243, 0.8);
}
.medium-editor-toolbar-form .medium-editor-toolbar-input:-ms-input-placeholder {
  color: #f8f5f3;
  color: rgba(248, 245, 243, 0.8);
}
.medium-editor-toolbar-form a {
  color: var(--color-text-inverse);
  -webkit-transform: translateY(2px);
  transform: translateY(2px);
}
.medium-editor-toolbar-form .medium-editor-toolbar-close {
  margin-right: 16px;
}
.medium-editor-toolbar-anchor-preview {
  background: var(--color-surface-inverse);
  border-radius: 50px;
  padding: 5px 12px;
}
.medium-editor-anchor-preview a {
  color: var(--color-text-inverse);
  text-decoration: none;
}
.medium-editor-toolbar-actions li,
.medium-editor-toolbar-actions button {
  border-radius: 50px;
}
</style>
