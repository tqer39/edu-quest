#!/bin/bash -u
# $1: デプロイパイプラインのパス
# $2: ベースブランチ
# $3: プルリクエストのヘッドブランチ
echo "\$1: $1"
echo "\$2: $2"
echo "\$3: $3"

git fetch origin "$2"
git fetch origin "$3"
git switch -C "$3"
CHANGED_FILES="$(git diff --name-only "origin/$2" "$3" | sort -u)"

echo "----------------------------------"
echo "CHANGED_FILES: "
echo "${CHANGED_FILES}"

# 差分がないなら強制終了。処理対象のデプロイパイプラインではないため 1 で返す。
if [ -z "${CHANGED_FILES}" ]; then
  echo "No changed."
  exit 1
fi

# 変更されたファイルがデプロイパイプラインの関連リソースなのかチェックする関数
# 引数
# $1: 変更されたファイルのパス
# $2: デプロイパイプライン
# ----------------------------------
# 戻り値
# 1: 処理対象外
function is_terraform_related_file () {
  case "$1" in
    *.tf|*.tfvars|*.tfvars.json|*.terraform.lock.hcl|*.tfbackend)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

function is_changed () {
  changed_file="$1"
  compare_path="$(echo "$2" | sed -e "s/\.\///g")" # "./" を削除
  echo "\$changed_file: ${changed_file}"
  echo "\$compare_path: ${compare_path}/*.*"

  if ! is_terraform_related_file "${changed_file}"; then
    echo "Terraform 関連ファイルではないため処理対象外です。"
    return 1
  fi

  # 1. 変更されたファイルが compare_path 配下にある場合
  if [[ $1 =~ ${compare_path}/.*\..*$ ]]; then
    echo "デプロイパイプラインで使用しているリソースが変更されたので処理対象です。"
    exit 0
  fi

  # 2. 変更されたファイルがモジュール配下にある場合、そのモジュールを使用しているかチェック
  if [[ $1 =~ infra/terraform/modules/ ]]; then
    # モジュール名を取得（例: domain-register-delegate）
    module_name=$(echo "$1" | sed -E 's|infra/terraform/modules/([^/]+).*|\1|')
    echo "モジュールの変更を検出: ${module_name}"

    # compare_path 配下の .tf ファイルでこのモジュールを使用しているかチェック
    # 相対パス (例: ../../../modules/domain-register-delegate) でマッチ
    tf_files=$(find "${compare_path}" -type f -name "*.tf" 2>/dev/null)
    for tf_file in $tf_files; do
      if grep -q "source.*modules/${module_name}" "${tf_file}"; then
        echo "モジュール ${module_name} を ${tf_file} で使用しているため処理対象です。"
        exit 0
      fi
    done
  fi

  # 3. compare_path 配下の .tf ファイルが参照しているモジュールの変更をチェック
  tf_files=$(find "${compare_path}" -type f -name "*.tf" 2>/dev/null)
  for tf_file in $tf_files; do
    if [[ "${tf_file}" =~ .*(provider|terraform)\.tf$ ]]; then
      # echo "[debug] ${tf_file}: provider.tf, terraform.tf は対象外。"
      continue
    fi

    # module "..." { の次の行の source があればそのパスを列挙する
    module_paths=$(awk '/module .+ {/{getline; if($1=="source") print $3}' "${tf_file}" | sed 's/"//g')
    # echo "[debug] ${module_paths}: ${module_paths}"
    if [ -z "${module_paths}" ]; then
      # echo "[debug] ${tf_file}: No modules."
      continue
    fi

    for module_path in $module_paths; do
      cd "${compare_path}" || exit 2
      abs_source_path="$(realpath -e "${module_path}" 2>/dev/null)"
      cd - > /dev/null || exit 2
      if [ -n "${abs_source_path}" ]; then
        # 再帰処理で追跡
        is_changed "${changed_file}" "${abs_source_path}"
      fi
    done
  done
  return 1
}

for file in $CHANGED_FILES; do
  if [[ "${file}" =~ ^\.github/(actions|workflows)/.*\.yml$ ]]; then
    echo "共通のワークフローが修正されたのでこのデプロイパイプラインは処理対象です。"
    exit 0
  fi
  is_changed "${file}" "$1"
done

# 追跡しきって変更がない場合は 1 で返す。
exit 1
