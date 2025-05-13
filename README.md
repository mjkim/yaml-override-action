# YAML Value Override GitHub Action

Override values in your YAML file using [yq](https://github.com/mikefarah/yq) or native YAML parsing with a simple GitHub Action.

## Features

- Override any value in a YAML file using different methods
- Multiple processing types available: native YAML parsing or yq processing
- Easy to use in your CI/CD workflows

## Inputs

| Name      | Description                | Required | Default        |
|-----------|----------------------------|----------|----------------|
| `file`    | Path to the YAML file to override | Yes      |               |
| `values`  | Override values (format depends on type) | Yes      |               |
| `type`    | Processing type (`yaml`, `yq`, or `yq_multiline`) | No      |  yaml         |

## Processing Types

This action supports three different methods for overriding YAML values:

### 1. `yaml` Type

Uses JavaScript's YAML parser to directly modify the file structure. The `values` input should be a valid YAML string with dot-notation keys.

```yaml
- uses: mjkim/yaml-override-action@v1
  with:
    file: values.yaml
    values: |
      key.nested: value
      foo: bar
      image.tag: ubuntu:latest
    type: yaml
```

### 2. `yq` Type

Processes each line of input as a separate yq expression. Each line is executed as an individual command.

```yaml
- uses: mjkim/yaml-override-action@v1
  with:
    file: values.yaml
    values: |
      .key="value"
      .foo="bar"
      .image.tag="ubuntu:latest"
    type: yq
```

### 3. `yq_multiline` Type

Processes the entire input as a single multiline yq expression.

```yaml
- uses: mjkim/yaml-override-action@v1
  with:
    file: values.yaml
    values: |
      .key="value" |
      .foo="bar" |
      .image.tag="ubuntu:latest"
    type: yq_multiline
```

## Example

Suppose you have the following `values.yaml`:

```yaml
key: old
foo: oldfoo
image:
  tag: oldtag
```

After running the action with any of the examples above, your `values.yaml` will be:

```yaml
key: value
foo: bar
image:
  tag: ubuntu:latest
```

## Usage Notes

- The `yaml` type is suitable for simple modifications and doesn't require external tools
- The `yq` types offer more powerful expressions but require the yq binary (included in the action)
- For complex yq operations, consider using `yq_multiline` type
- The action works on runners with bash and Linux environment
