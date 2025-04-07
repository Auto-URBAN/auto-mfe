<template>
    <div class="flex flex-col mb-4">
        <label v-if="label" :for="id" class="mb-2 font-bold text-gray-700">
            {{ label }} 
            <UTooltip :delay-duration="0" :text="description" v-if="description">
                <Icon name="uil:info-circle" size="24px" class="flex-none" v-if="description" />
            </UTooltip>
        </label>
        <input
            :id="id"
            :type="type === 'money' ? 'text' : type"
            :placeholder="placeholder"
            :value="formattedValue"
            @input="handleInput"
            :disabled="disabled"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
</template>

<script>
export default {
    name: "Input",
    props: {
        modelValue: {
            type: [String, Number],
            default: "",
        },
        label: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        id: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "text",
        },
        placeholder: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        min: {
            type: Number,
            default: null,
        },
        max: {
            type: Number,
            default: null,
        },
        step: {
            type: Number,
            default: null,
        },
    },
    computed: {
        formattedValue() {
            if (this.type === "money") {
                const value = parseFloat(this.modelValue) || 0;
                return value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            }
            return this.modelValue;
        },
    },
    methods: {
        handleInput(event) {
            let value = event.target.value;
            if (this.type === "money") {
                value = value.replace(/[^\d.-]/g, ""); // Remove caracteres não numéricos
            }
            this.$emit("update:modelValue", value);
        },
    },
};
</script>
