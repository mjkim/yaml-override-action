# YAML Value Override GitHub Action

Override values in your YAML file using [yq](https://github.com/mikefarah/yq) with a simple GitHub Action.

## Features

- Override any value in a YAML file using a concise template syntax.
- Powered by `yq` for robust YAML processing.
- Easy to use in your CI/CD workflows.

## Inputs

| Name      | Description                | Required | Default        |
|-----------|----------------------------|----------|----------------|
| `values`  | Path to the YAML file to override | No       | `values.yaml`  |
| `template`| Override instructions (one per line, yq syntax) | Yes      |                |

## Usage

```yaml
- uses: mjkim/yaml-override-action@v0
  with:
    template: |
      .key="value"
      .foo="bar"
      .image.tag="ubuntu:latest"
    values: values.yaml
```

- `template`: Each line should be a yq expression for overriding a value.
- `values`: (Optional) Path to your YAML file. Defaults to `values.yaml`.

## Example

Suppose you have the following `values.yaml`:

```yaml
key: old
foo: oldfoo
image:
  tag: oldtag
```

After running the action with the above example, your `values.yaml` will be:

```yaml
key: value
foo: bar
image:
  tag: ubuntu:latest
```

## Notes

- This action uses a statically built `yq` binary for Linux.
- The action works on runners with bash and Linux environment.
