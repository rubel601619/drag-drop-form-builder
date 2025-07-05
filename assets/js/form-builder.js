const { createApp, nextTick } = Vue;

createApp({
   data() {
      return {
         dropFields: JSON.parse(localStorage.getItem("formFields") || "[]"),
         selectedField: null,
         dragType: "",
         elementFields: [
            "text",
            "number",
            "date",
            "time",
            "select",
            "hyperlink",
         ],
      };
   },
   mounted() {
      nextTick(() => {
         new Sortable(this.$refs.dropZone, {
            animation: 150,
            handle: ".draggable-item",
            onEnd: (evt) => {
               const movedItem = this.dropFields.splice(evt.oldIndex, 1)[0];
               this.dropFields.splice(evt.newIndex, 0, movedItem);
            },
            // prevent Sortable from cloning or inserting DOM directly
            ghostClass: "ghost",
            forceFallback: true,
         });
      });
   },
   methods: {
      isInputField() {
         if (
            field.type === "text" ||
            field.type === "number" ||
            field.type === "date" ||
            field.type === "time"
         ) {
            return true;
         }
      },
      getLabelPlaceholder() {
         let label = "";
         if (this.dragType == "text") {
            label = "Text Field";
         } else if (this.dragType == "number") {
            label = "Number";
         } else if (this.dragType == "date") {
            label = "Date";
         } else if (this.dragType == "time") {
            label = "Time";
         } else if (this.dragType == "select") {
            label = "Select Field";
         } else if (this.dragType == "hyperlink") {
            label = "Link";
         }

         return label;
      },
      dragStart(type) {
         this.dragType = type;
      },
      generateUID() {
         return (
            Date.now().toString() + Math.random().toString(36).substring(2, 6)
         );
      },
      onDrop(event) {
         let label = this.getLabelPlaceholder();

         const newField = {
            uid: this.generateUID(),
            type: this.dragType,
            label: label,
            placeholder: label,
            value: this.dragType === "select" ? ["Option 1"] : [],
         };

         // Find the element at the drop position
         const dropZone = this.$refs.dropZone;
         const children = Array.from(dropZone.children);

         // Get mouse Y coordinate of drop
         const mouseY = event.clientY;

         // Find index where to insert
         let insertIndex = children.length; // default at the end

         for (let i = 0; i < children.length; i++) {
            const rect = children[i].getBoundingClientRect();
            // If mouse is above the center of this child, insert here
            if (mouseY < rect.top + rect.height / 2) {
               insertIndex = i;
               break;
            }
         }

         // Insert new field at the calculated index
         this.dropFields.splice(insertIndex, 0, newField);
         this.selectedField = newField;
      },
      selectField(field) {
         this.selectedField = field;
      },
      addOption() {
         if (this.selectedField && this.selectedField.type === "select") {
            this.selectedField.value.push("");
         }
      },
      removeOption(index) {
         if (this.selectedField && this.selectedField.type === "select") {
            this.selectedField.value.splice(index, 1);
         }
      },
      saveToLocalStorage() {
         localStorage.setItem("formFields", JSON.stringify(this.dropFields));
         alert("Saved!");
      },
      removeField(index) {
         if (this.dropFields[index].uid === this.selectedField?.uid) {
            this.selectedField = null;
         }
         this.dropFields.splice(index, 1);
      },
   },
}).mount("#app");
