<template>
  <div class="dc-editable-input">
    <span :for="label" class="dc-input__label" :id="labelId">{{labelSpanText}}</span>
    <div class="dc-input__wrapper">
      <input
        :aria-labelledby="labelId"
        class="dc-input__input"
        v-model="val"
        @keydown="handleKeyDown"
        @input="update"
        ref="input"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'editableInput',
  props: {
    label: String,
    labelText: String,
    value: [String, Number],
    max: Number,
    min: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val: {
      get () {
        return this.value;
      },
      set (v) {
        // TODO: min
        if (!(this.max === undefined) && +v > this.max) {
          this.$refs.input.value = this.max;
        } else {
          return v;
        }
      }
    },
    labelId () {
      return `input__label__${this.label}__${Math.random().toString().slice(2, 5)}`;
    },
    labelSpanText () {
      return this.labelText || this.label;
    }
  },
  methods: {
    update (e) {
      this.handleChange(e.target.value);
    },
    handleChange (newVal) {
      let data = {};
      data[this.label] = newVal;
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data);
      } else if (newVal.length > 5) {
        this.$emit('change', data);
      }
    },
    // **** unused
    // handleBlur (e) {
    //   console.log(e)
    // },
    handleKeyDown (e) {
      let val = this.val;
      let number = Number(val);

      if (number) {
        let amount = this.arrowOffset || 1;

        // Up
        if (e.keyCode === 38) {
          val = number + amount;
          this.handleChange(val);
          e.preventDefault();
        }

        // Down
        if (e.keyCode === 40) {
          val = number - amount;
          this.handleChange(val);
          e.preventDefault();
        }
      }
    }
    // **** unused
    // handleDrag (e) {
    //   console.log(e)
    // },
    // handleMouseDown (e) {
    //   console.log(e)
    // }
  }
};
</script>

<style scoped>
.dc-editable-input {
  display: flex;
  align-items: center;
  position: relative;
}
.dc-input__wrapper {
  flex-grow: 1;
}
.dc-input__input {
  padding: 0;
  border: 0;
  outline: none;
}
.dc-input__label {
  text-transform: capitalize;
}
</style>
