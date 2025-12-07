# サンプル問題

## 問題文

以下のRustコードは所有権の問題でコンパイルエラーになります。このコードを修正して、コンパイルが成功するようにしてください。

```rust
fn add_numbers(a: String, b: String) -> String {
    let sum = a.parse::<i32>().unwrap() + b.parse::<i32>().unwrap();
    sum.to_string()
}
```

## 入出力例

```txt

5 7
12
```
