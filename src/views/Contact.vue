<script setup lang="ts">
    import { ref, ComputedRef, computed } from 'vue'
    import axios from 'axios'

    interface Errors {
        name: string,
        kana: string,
        tel: string,
        email: string,
        [key:string]: string
    }

    const name = ref<string>()
    const kana = ref<string>()
    const tel = ref<string>()
    const email = ref<string>()
    const result = ref<any>()
    const validKatakana = (kana:string) => {
        const re = /^[ァ-ンｧ-ﾝ\x20\u3000ﾞﾟ]*$/;
        return re.test(kana);
    }
    const validTel = (tel:string) => {
        const re = /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/;
        return re.test(tel);
    }
    const validEmail = (email:string) => {
        const re = /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
        return re.test(email);
    }
    const clear = () => {
        name.value = '';
        kana.value = '';
        tel.value = '';
        email.value = '';
    }
    const checkName:ComputedRef<string> = computed(() => {
        if(!name.value){
            return 'お名前を入力してください';
        }
        return '';
    })
    const checkKana:ComputedRef<string> = computed(() => {
        if(!kana.value){
            return 'フリガナを入力してください';
        } else if(!validKatakana(kana.value)){
            return 'フリガナをカタカナで入力してください';
        }
        return '';
    })
    const checkTel:ComputedRef<string> = computed(() =>{
        if(!tel.value){
            return '電話番号を入力してください';
        } else if(!validTel(tel.value)){
            return '電話番号を正しく入力してください';
        }
        return '';
    })
    const checkEmail:ComputedRef<string> = computed(() => {
        if(!email.value){
            return 'メールアドレスを入力してください';
        } else if(!validEmail(email.value)){
            return 'メールアドレスを正しく入力してください';
        }
        return '';
    })
    // ここはコンピューティッドじゃなくてリアクティブにしないといけない
    const errors = computed(():Errors => {
        console.log(checkName.value,checkKana.value,checkTel.value,checkEmail.value)
        const errors:Errors = {
            name: checkName.value,
            kana: checkKana.value,
            tel: checkTel.value,
            email: checkEmail.value,
        }
        for (const key in errors) {
            console.log(errors[key])
            if (errors[key] === '' || errors[key] === null || errors[key] === undefined) {
                delete errors[key];
            }
        }
        return errors;
    })
    const valid = computed(() => {
        console.log(checkName.value,checkKana.value,checkTel.value,checkEmail.value)
        return !Object.keys(errors.value).length;
    })
    const submit =  async ():Promise<void> => {
        result.value = await send()
        console.log(result.value)
        if(result.value === '送信完了'){
            clear();
        }
    }
    const send = async ():Promise<any> => {
        const url = 'http://localhost:3000/test.php';
        const params = {
            'name': name.value,
            'kana': kana.value,
            'tel': tel.value,
            'email': email.value
        }
        return await axios
            .post(url, params)
            .then(function(res){
                return res.data;
            })
            .catch(function(error){
                console.log(error);
        });
    }
</script>

<template>
    <div class="contact">
        <h2>お問合せ</h2>
        <form method="post" action="" class="contact-form">
            <table>
                <tbody>
                    <tr>
                        <th>お名前</th>
                        <td>
                            <input v-model="name" placeholder="例）田中 太郎">
                            <p class="error">{{ errors?.name }}</p>
                        </td>
                    </tr>
                    <tr>
                        <th>フリガナ</th>
                        <td>
                            <input v-model="kana" placeholder="例）タナカ タロウ">
                            <p class="error">{{ errors?.kana }}</p>
                        </td>
                    </tr>
                    <tr>
                        <th>電話番号</th>
                        <td>
                            <input v-model="tel" placeholder="例）0120-000-000">
                            <p class="error">{{ errors?.tel }}</p>
                        </td>
                    </tr>
                    <tr>
                        <th>メールアドレス</th>
                        <td>
                            <input v-model="email" placeholder="例）info@example.co.jp">
                            <p class="error">{{ errors?.email }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            {{valid}}
            <button v-if="!valid" :disabled="!valid" type="button">未入力の必須項目があります</button>
            <button v-else-if="valid" type="button" @click="submit">送信</button>
        </form>
    </div>
</template>

<style scoped>
div, p, h2, ul, li {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.contact {
    width: 100%;
    max-width: 600px;
    padding: 28px;
    margin: 0 auto;
    background-color: #eeeeee;
}
.contact h2 {
    margin: 0 0 28px 0;
}
.contact-form table {
    width: 100%;
    margin: 0 0 28px 0;
    border-collapse: collapse;
}
.contact-form table tr {
    border-bottom: 2px solid #cccccc;
}
.contact-form table tbody tr th {
    width: 25%;
    padding: 20px 10px;
    text-align: left;
}
.contact-form table tbody tr td {
    width: 75%;
    padding: 20px;
    text-align: left;
}
.contact-form table tbody tr td input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}
.contact-form .error {
    margin: 0;
    color: #ff0000;
    font-weight: bold;
    font-size: .85rem;
}
.contact-form button {
    display: block;
    width: 300px;
    padding: 10px 0;
    margin: 0 auto;
    color: #ffffff;
    border: 0;
    box-shadow: none;
    background-color: #384878;
    cursor: pointer;
}
.contact-form button:disabled {
    background-color: #a5a5a5;
}
.contact-result {
    padding: 5px 0;
    margin: 28px auto 0 auto;
    color: #ffffff;
    box-sizing: border-box;
    background-color: #00c2bc;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .7s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>